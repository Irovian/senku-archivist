#!/usr/bin/env python3
"""Check cleaned EPP workspace metadata references after import sanitization."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any


DISALLOWED_KEYS = {
    "source_path",
    "source_paths",
    "original_source_files_path",
    "copied_original_source_files",
    "missing_original_source_files",
}
DISALLOWED_STRING_MARKERS = (
    ".docx",
    ".xlsx",
    ".xls",
    ".doc",
    "source-files",
    "source-annotations",
)


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def iter_metadata_json(workspace_root: Path) -> list[Path]:
    paths = [workspace_root / "workspace.json"]
    for dirname in ("project", "extracts"):
        root = workspace_root / dirname
        if root.exists():
            paths.extend(sorted(root.rglob("*.json")))
    return [path for path in paths if path.exists()]


def walk_metadata(value: Any, path: Path, json_path: str, errors: list[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key.lower() in DISALLOWED_KEYS:
                errors.append(f"{path}:{json_path}.{key}: disallowed metadata key")
            walk_metadata(child, path, f"{json_path}.{key}", errors)
        return
    if isinstance(value, list):
        for index, child in enumerate(value):
            walk_metadata(child, path, f"{json_path}[{index}]", errors)
        return
    if isinstance(value, str):
        lowered = value.lower()
        for marker in DISALLOWED_STRING_MARKERS:
            if marker in lowered:
                errors.append(f"{path}:{json_path}: disallowed metadata reference {marker!r}")
        if value.startswith("_content/") or value.startswith("_project/") or value.startswith("_sources/"):
            errors.append(f"{path}:{json_path}: unnormalized upstream path {value!r}")


def validate_catalog(workspace_root: Path, errors: list[str]) -> tuple[dict[str, dict], list[dict]]:
    catalog_path = workspace_root / "project" / "catalog.json"
    if not catalog_path.exists():
        errors.append(f"{catalog_path}: missing normalized app-facing catalog")
        return {}, []
    catalog = read_json(catalog_path)
    sources = {
        source.get("source_id"): source
        for source in catalog.get("sources", [])
        if source.get("source_id")
    }
    if len(sources) != len(catalog.get("sources", [])):
        errors.append(f"{catalog_path}: source records must have unique source_id values")

    for source in catalog.get("sources", []):
        source_id = source.get("source_id")
        retention = source.get("retention")
        if retention == "retained_regulatory_source":
            retained_path = source.get("path") or source.get("retained_path")
            if not isinstance(retained_path, str) or not retained_path.startswith("sources/regulatory/"):
                errors.append(f"{catalog_path}:{source_id}: retained regulatory source lacks app-facing source path")
            elif not (workspace_root / retained_path).exists():
                errors.append(f"{catalog_path}:{source_id}: retained regulatory source path is missing: {retained_path}")
        elif retention == "provenance_only":
            if source.get("browseable") is not False:
                errors.append(f"{catalog_path}:{source_id}: provenance-only source must not be browseable")
            if source.get("source_file_retained") is not False:
                errors.append(f"{catalog_path}:{source_id}: provenance-only source must not be retained as a file")

    documents = catalog.get("documents", [])
    for document in documents:
        doc_id = document.get("doc_id")
        path = document.get("path")
        if not isinstance(path, str) or not path.startswith("content/"):
            errors.append(f"{catalog_path}:{doc_id}: document path must be app-facing content/")
        for source_id in document.get("source_ids", []):
            if source_id not in sources:
                errors.append(f"{catalog_path}:{doc_id}: unresolved source_id {source_id}")

    return sources, documents


def validate_manifest(workspace_root: Path, sources: dict[str, dict], catalog_documents: list[dict], errors: list[str]) -> None:
    manifest_path = workspace_root / "workspace.json"
    manifest = read_json(manifest_path)
    if manifest.get("source_reference", {}).get("path"):
        errors.append(f"{manifest_path}: source_reference.path must not expose an absolute source checkout")
    if "original_source_files_path" in manifest.get("canonical_source", {}):
        errors.append(f"{manifest_path}: canonical_source.original_source_files_path must be absent")
    import_summary = manifest.get("import_summary", {})
    for key in ("source_count", "copied_original_source_files", "missing_original_source_files"):
        if key in import_summary:
            errors.append(f"{manifest_path}: import_summary.{key} must be absent")
    if import_summary.get("document_count") != len(catalog_documents):
        errors.append(
            f"{manifest_path}: import_summary.document_count does not match catalog "
            f"({import_summary.get('document_count')} != {len(catalog_documents)})"
        )
    if len(manifest.get("documents", [])) != len(catalog_documents):
        errors.append(f"{manifest_path}: manifest document list does not match catalog document count")
    for document in manifest.get("documents", []):
        doc_id = document.get("doc_id")
        for source_id in document.get("source_ids", []):
            if source_id not in sources:
                errors.append(f"{manifest_path}:{doc_id}: unresolved source_id {source_id}")


def main() -> int:
    workspace_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path("workspaces/epp-full").resolve()
    if not (workspace_root / "workspace.json").exists():
        print(f"Missing workspace manifest: {workspace_root / 'workspace.json'}", file=sys.stderr)
        return 2

    errors: list[str] = []
    for path in iter_metadata_json(workspace_root):
        walk_metadata(read_json(path), path, "$", errors)

    sources, catalog_documents = validate_catalog(workspace_root, errors)
    validate_manifest(workspace_root, sources, catalog_documents, errors)

    if errors:
        print("EPP reference-integrity check failed:")
        for error in errors[:200]:
            print(f"- {error}")
        if len(errors) > 200:
            print(f"- ... {len(errors) - 200} additional errors")
        return 1

    print(f"EPP reference-integrity check passed for {workspace_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
