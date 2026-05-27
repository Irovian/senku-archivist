#!/usr/bin/env python3
"""Import the full Emergency Prep Project workspace into Archivist."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = Path("~/Dovaxis - DevOps/Emergency Prep Project").expanduser()
DEFAULT_TARGET = ROOT / "workspaces" / "epp-full"
DEFAULT_STAGING_ROOT = ROOT / ".tmp" / "epp-import"


COPY_DIRS = (
    ("_content", "content"),
    ("_project", "project"),
    ("_extracts", "extracts"),
    ("_sources", "sources"),
)
APP_STATE_DIRS = ("audit", "workbook-state", "runtime")
IMPORTED_SURFACES = ("content", "project", "extracts", "sources", "workspace.json")
ORIGINAL_OFFICE_EXTENSIONS = (".docx", ".xlsx", ".xls", ".doc")
OMIT = object()


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def copy_dir(source: Path, target: Path) -> int:
    if not source.exists():
        return 0
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)
    return sum(1 for path in target.rglob("*") if path.is_file())


def file_count(path: Path) -> int:
    if not path.exists():
        return 0
    return sum(1 for child in path.rglob("*") if child.is_file())


def git_value(source_root: Path, *args: str) -> str | None:
    try:
        value = subprocess.check_output(
            ["git", "-C", str(source_root), *args],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (OSError, subprocess.CalledProcessError):
        return None
    return value or None


def group_label(value: str) -> str:
    return value.replace("-", " ").replace("_", " ").title()


def source_label(source_root: Path) -> str:
    return source_root.name or "Emergency Prep Project local checkout"


def is_editable(document: dict) -> bool:
    content_group = str(document.get("content_group", ""))
    content_type = str(document.get("content_type", ""))
    return content_group != "regulatory" and not content_type.startswith("regulatory")


def normalize_imported_path(value: str) -> str:
    normalized = value.replace("\\", "/")
    if normalized.startswith("_content/"):
        return "content/" + normalized.removeprefix("_content/")
    if normalized.startswith("_project/"):
        return "project/" + normalized.removeprefix("_project/")
    if normalized.startswith("_extracts/"):
        return "extracts/" + normalized.removeprefix("_extracts/")
    if normalized.startswith("_sources/"):
        return "sources/" + normalized.removeprefix("_sources/")
    return normalized


def has_office_extension(value: str) -> bool:
    lowered = value.lower()
    return any(extension in lowered for extension in ORIGINAL_OFFICE_EXTENSIONS)


def is_retained_regulatory_source(source: dict) -> bool:
    path = str(source.get("path") or source.get("source_path") or "")
    source_role = str(source.get("source_role", ""))
    return path.startswith("_sources/regulatory/") or source_role in {
        "primary_regulatory_source",
        "raw_regulatory_source",
    }


def sanitize_label(source: dict) -> str:
    title = str(source.get("title") or "").strip()
    if title:
        return title
    raw_path = str(source.get("path") or source.get("source_path") or source.get("source_id") or "")
    if raw_path:
        return Path(raw_path).stem
    return "Source provenance"


def sanitize_scalar(value: str) -> str | object:
    normalized = normalize_imported_path(value)
    lowered = normalized.lower()
    if "source-files" in lowered:
        return OMIT
    if has_office_extension(normalized):
        return OMIT
    return normalized


def is_removed_target_key(key: str) -> bool:
    lowered = key.lower()
    return lowered in {
        "open_target",
        "download_target",
        "browse_target",
        "attachment_target",
        "open_path",
        "download_path",
        "browse_path",
        "attachment_path",
        "source_path",
        "source_paths",
        "original_source_files_path",
        "copied_original_source_files",
        "missing_original_source_files",
    }


def sanitize_json(value: Any) -> Any:
    if isinstance(value, dict):
        sanitized: dict[str, Any] = {}
        for key, child in value.items():
            lowered = key.lower()
            if lowered == "source_path":
                if isinstance(child, str) and normalize_imported_path(child).startswith("sources/regulatory/"):
                    sanitized["retained_path"] = normalize_imported_path(child)
                continue
            if lowered == "source_paths":
                continue
            if lowered == "source_files":
                cleaned_child = sanitize_json(child)
                if cleaned_child is not OMIT:
                    sanitized["source_metadata_files"] = cleaned_child
                continue
            if is_removed_target_key(key):
                continue
            if lowered == "path" and isinstance(child, str):
                cleaned_path = sanitize_scalar(child)
                if cleaned_path is not OMIT:
                    sanitized[key] = cleaned_path
                continue
            cleaned_child = sanitize_json(child)
            if cleaned_child is not OMIT:
                sanitized[key] = cleaned_child
        return sanitized
    if isinstance(value, list):
        sanitized_items = []
        for item in value:
            cleaned_item = sanitize_json(item)
            if cleaned_item is not OMIT:
                sanitized_items.append(cleaned_item)
        return sanitized_items
    if isinstance(value, str):
        return sanitize_scalar(value)
    return value


def normalize_source_record(source: dict) -> dict:
    if is_retained_regulatory_source(source):
        sanitized = sanitize_json(source)
        if isinstance(sanitized, dict):
            sanitized["retention"] = "retained_regulatory_source"
            sanitized["browseable"] = True
            if "path" in sanitized and isinstance(sanitized["path"], str):
                sanitized["path"] = normalize_imported_path(sanitized["path"])
            return sanitized
    return {
        "source_id": source.get("source_id"),
        "source_type": "provenance_stub",
        "original_source_type": source.get("source_type"),
        "section": source.get("section"),
        "label": sanitize_label(source),
        "title": sanitize_label(source),
        "extract_status": source.get("extract_status"),
        "source_role": source.get("source_role", "original_catalog_source"),
        "retention": "provenance_only",
        "browseable": False,
        "source_file_retained": False,
    }


def normalize_catalog(catalog: dict) -> tuple[dict, int, int]:
    normalized = {
        key: sanitize_json(value)
        for key, value in catalog.items()
        if key not in {"documents", "sources"}
    }
    raw_sources = catalog.get("sources", [])
    retained_count = sum(1 for source in raw_sources if is_retained_regulatory_source(source))
    normalized["sources"] = [normalize_source_record(source) for source in raw_sources]
    normalized["documents"] = [sanitize_json(document) for document in catalog.get("documents", [])]
    provenance_count = len(normalized["sources"]) - retained_count
    return normalized, provenance_count, retained_count


def manifest_documents(catalog: dict) -> list[dict]:
    documents: list[dict] = []
    for document in catalog.get("documents", []):
        raw_path = str(document.get("path", ""))
        content_path = normalize_imported_path(raw_path)
        meta_path = str(Path(content_path).with_name("document.meta.json"))
        documents.append(
            {
                "doc_id": document.get("doc_id"),
                "title": document.get("title"),
                "group": group_label(str(document.get("content_group", "uncategorized"))),
                "content_group": document.get("content_group"),
                "content_type": document.get("content_type"),
                "lifecycle_status": document.get("lifecycle_status"),
                "path": content_path,
                "meta_path": meta_path,
                "editable": is_editable(document),
                "source_ids": document.get("source_ids", []),
                "requirement_ids": document.get("requirement_ids", []),
                "placeholder_ids": document.get("placeholder_ids", []),
            }
        )
    return documents


def is_workbook_artifact(artifact: dict) -> bool:
    artifact_type = str(artifact.get("artifact_type", ""))
    renderer_template = str(artifact.get("renderer_template", ""))
    return "workbook" in artifact_type or "workbook" in renderer_template


def default_workbook_payload(artifact: dict) -> dict:
    return {
        "schema_version": "archivist-workbook-state/v1",
        "workspace_id": "epp-full",
        "parent_document_id": artifact.get("doc_id"),
        "workbook_id": artifact.get("artifact_id"),
        "artifact_type": artifact.get("artifact_type"),
        "renderer_template": artifact.get("renderer_template"),
        "status": "approved",
        "state_payload": {},
        "derived_outputs": {},
        "validation": {
            "status": "not_validated",
            "messages": [],
        },
        "audit": {
            "created_at": utc_now(),
            "updated_at": utc_now(),
            "created_by": "import_epp_workspace.py",
            "approved_at": None,
            "approved_by": None,
            "linked_commit": None,
        },
    }


def seed_workbook_sidecars(target_root: Path) -> int:
    artifact_index_path = target_root / "project" / "artifact_index_seed.json"
    if not artifact_index_path.exists():
        return 0
    artifact_index = read_json(artifact_index_path)
    seeded = 0
    for artifact in artifact_index.get("artifacts", []):
        if not is_workbook_artifact(artifact):
            continue
        doc_id = artifact.get("doc_id")
        workbook_id = artifact.get("artifact_id")
        if not doc_id or not workbook_id:
            continue
        sidecar_path = target_root / "workbook-state" / str(doc_id) / str(workbook_id) / "approved.json"
        if sidecar_path.exists():
            continue
        write_json(sidecar_path, default_workbook_payload(artifact))
        seeded += 1
    return seeded


def sanitize_project_json(project_root: Path, catalog: dict) -> tuple[dict, int, int]:
    normalized_catalog, provenance_source_count, retained_regulatory_source_count = normalize_catalog(catalog)
    write_json(project_root / "catalog.json", normalized_catalog)
    for json_path in sorted(project_root.glob("*.json")):
        if json_path.name == "catalog.json":
            continue
        write_json(json_path, sanitize_json(read_json(json_path)))
    return normalized_catalog, provenance_source_count, retained_regulatory_source_count


def sanitize_extracted_context(candidate_root: Path, retained_source_ids: set[str]) -> int:
    source_annotations = candidate_root / "extracts" / "source-annotations"
    if source_annotations.exists():
        shutil.rmtree(source_annotations)

    extracted_sources = candidate_root / "extracts" / "sources"
    removed = 0
    if extracted_sources.exists():
        for source_dir in sorted(path for path in extracted_sources.iterdir() if path.is_dir()):
            if source_dir.name not in retained_source_ids:
                shutil.rmtree(source_dir)
                removed += 1
                continue
            meta_path = source_dir / "source.meta.json"
            if meta_path.exists():
                write_json(meta_path, sanitize_json(read_json(meta_path)))
    return removed


def copy_app_state(live_root: Path, candidate_root: Path) -> int:
    preserved = 0
    for dirname in APP_STATE_DIRS:
        source = live_root / dirname
        target = candidate_root / dirname
        if not source.exists():
            continue
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
        preserved += file_count(target)
    audit_path = candidate_root / "audit" / "ledger.jsonl"
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    if not audit_path.exists():
        audit_path.write_text("", encoding="utf-8")
    return preserved


def build_manifest(
    source_root: Path,
    catalog: dict,
    provenance_source_count: int,
    retained_regulatory_source_count: int,
    copied_workspace_files: dict[str, int],
    preserved_state_file_count: int,
    removed_extracted_source_count: int,
) -> dict:
    commit = git_value(source_root, "rev-parse", "HEAD")
    branch = git_value(source_root, "rev-parse", "--abbrev-ref", "HEAD")
    documents = manifest_documents(catalog)
    return {
        "schema_version": 1,
        "workspace_id": "epp-full",
        "name": "EPP Manual Full",
        "description": "Full Emergency Prep Project workspace imported for Archivist parity, renderer, history, and artifact work.",
        "imported_at": utc_now(),
        "source_reference": {
            "kind": "local_repo_import",
            "label": source_label(source_root),
            "branch_at_import": branch,
            "commit_at_import": commit,
        },
        "canonical_source": {
            "kind": "markdown_bundles",
            "content_path": "content",
            "project_data_path": "project",
            "extracted_source_path": "extracts",
            "regulatory_source_path": "sources",
            "workbook_state_path": "workbook-state",
            "draft_workbook_state_path": "runtime/workbook-state",
            "write_policy": "proposal_review_required",
        },
        "history": {
            "mode": "git_plus_archivist_ledger",
            "git_strategy": "workspace_repository_preferred",
            "latest_view": "latest_approved_or_current_tracked_markdown",
            "drafts_committed": False,
        },
        "audit": {
            "ledger_path": "audit/ledger.jsonl",
            "links_to_git_commits": True,
        },
        "import_summary": {
            "document_count": len(documents),
            "provenance_source_count": provenance_source_count,
            "retained_regulatory_source_count": retained_regulatory_source_count,
            "content_groups": sorted({doc.get("content_group") for doc in documents if doc.get("content_group")}),
            "content_types": sorted({doc.get("content_type") for doc in documents if doc.get("content_type")}),
            "copied_workspace_files": copied_workspace_files,
            "preserved_state_file_count": preserved_state_file_count,
            "removed_development_extracted_source_count": removed_extracted_source_count,
        },
        "documents": documents,
    }


def validation_script(name: str) -> Path:
    return ROOT / "scripts" / name


def run_validation(script_name: str, workspace_root: Path) -> None:
    subprocess.check_call(["python3", str(validation_script(script_name)), str(workspace_root)])


def append_import_event(candidate_root: Path, manifest: dict, seeded_workbook_sidecars: int) -> None:
    event = {
        "schema_version": 1,
        "event_type": "workspace_import_refreshed",
        "workspace_id": manifest["workspace_id"],
        "created_at": utc_now(),
        "source": manifest["source_reference"],
        "counts": {
            "document_count": manifest["import_summary"]["document_count"],
            "provenance_source_count": manifest["import_summary"]["provenance_source_count"],
            "retained_regulatory_source_count": manifest["import_summary"]["retained_regulatory_source_count"],
            "preserved_state_file_count": manifest["import_summary"]["preserved_state_file_count"],
            "seeded_workbook_sidecar_count": seeded_workbook_sidecars,
        },
        "validation": {
            "source_leak_check": "passed",
            "reference_integrity_check": "passed",
        },
    }
    audit_path = candidate_root / "audit" / "ledger.jsonl"
    with audit_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, ensure_ascii=False, sort_keys=True) + "\n")


def promote_candidate(candidate_root: Path, target_root: Path, staging_root: Path) -> None:
    backup_root = staging_root / "previous-live"
    if backup_root.exists():
        shutil.rmtree(backup_root)
    target_root.parent.mkdir(parents=True, exist_ok=True)
    if target_root.exists():
        target_root.rename(backup_root)
    try:
        candidate_root.rename(target_root)
    except Exception:
        if target_root.exists():
            shutil.rmtree(target_root)
        if backup_root.exists():
            backup_root.rename(target_root)
        raise
    if backup_root.exists():
        shutil.rmtree(backup_root)


def import_workspace(source_root: Path, target_root: Path, staging_root: Path) -> dict:
    catalog_path = source_root / "_project" / "catalog.json"
    if not catalog_path.exists():
        raise SystemExit(f"Missing catalog: {catalog_path}")

    if staging_root.exists():
        shutil.rmtree(staging_root)
    staging_root.mkdir(parents=True, exist_ok=True)
    candidate_root = staging_root / "epp-full-candidate"
    candidate_root.mkdir(parents=True, exist_ok=True)

    copied_dirs: dict[str, int] = {}
    for source_name, target_name in COPY_DIRS:
        copied_dirs[target_name] = copy_dir(source_root / source_name, candidate_root / target_name)

    catalog = read_json(catalog_path)
    normalized_catalog, provenance_source_count, retained_regulatory_source_count = sanitize_project_json(
        candidate_root / "project",
        catalog,
    )
    retained_source_ids = {
        source["source_id"]
        for source in normalized_catalog.get("sources", [])
        if source.get("retention") == "retained_regulatory_source"
    }
    removed_extracted_source_count = sanitize_extracted_context(candidate_root, retained_source_ids)
    preserved_state_file_count = copy_app_state(target_root, candidate_root)
    seeded_workbook_sidecars = seed_workbook_sidecars(candidate_root)

    manifest = build_manifest(
        source_root,
        normalized_catalog,
        provenance_source_count,
        retained_regulatory_source_count,
        copied_dirs,
        preserved_state_file_count,
        removed_extracted_source_count,
    )
    manifest["import_summary"]["seeded_workbook_sidecar_count"] = seeded_workbook_sidecars
    write_json(candidate_root / "workspace.json", manifest)

    run_validation("check_epp_workspace_references.py", candidate_root)
    run_validation("check_epp_workspace_source_leaks.py", candidate_root)
    append_import_event(candidate_root, manifest, seeded_workbook_sidecars)
    run_validation("check_epp_workspace_references.py", candidate_root)
    run_validation("check_epp_workspace_source_leaks.py", candidate_root)

    promote_candidate(candidate_root, target_root, staging_root)
    if staging_root.exists():
        shutil.rmtree(staging_root)

    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Path to the original EPP repo.")
    parser.add_argument("--target", type=Path, default=DEFAULT_TARGET, help="Target Archivist workspace path.")
    parser.add_argument(
        "--staging-root",
        type=Path,
        default=DEFAULT_STAGING_ROOT,
        help="Hidden staging directory used before live workspace promotion.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest = import_workspace(
        args.source.expanduser().resolve(),
        args.target.expanduser().resolve(),
        args.staging_root.expanduser().resolve(),
    )
    summary = manifest["import_summary"]
    print(
        "Imported {document_count} documents into {workspace_id}; "
        "{provenance_source_count} provenance-only source records, "
        "{retained_regulatory_source_count} retained regulatory sources, "
        "{preserved_state_file_count} preserved app-state files, "
        "and {seeded_workbook_sidecar_count} seeded workbook sidecars.".format(
            workspace_id=manifest["workspace_id"],
            **summary,
        )
    )


if __name__ == "__main__":
    main()
