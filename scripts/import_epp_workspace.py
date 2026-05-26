#!/usr/bin/env python3
"""Import the full Emergency Prep Project workspace into Archivist."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = Path("~/Dovaxis - DevOps/Emergency Prep Project").expanduser()
DEFAULT_TARGET = ROOT / "workspaces" / "epp-full"


COPY_DIRS = (
    ("_content", "content"),
    ("_project", "project"),
    ("_extracts", "extracts"),
    ("_sources", "sources"),
)


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


def copy_source_file(source_root: Path, target_root: Path, relative_path: str) -> bool:
    source_path = source_root / relative_path
    if not source_path.exists() or not source_path.is_file():
        return False
    target_path = target_root / relative_path
    target_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_path, target_path)
    return True


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


def is_editable(document: dict) -> bool:
    content_group = str(document.get("content_group", ""))
    content_type = str(document.get("content_type", ""))
    return content_group != "regulatory" and not content_type.startswith("regulatory")


def manifest_documents(catalog: dict) -> list[dict]:
    documents: list[dict] = []
    for document in catalog.get("documents", []):
        raw_path = str(document.get("path", ""))
        if raw_path.startswith("_content/"):
            content_path = "content/" + raw_path.removeprefix("_content/")
        else:
            content_path = raw_path
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


def build_manifest(source_root: Path, target_root: Path, catalog: dict, copied_source_files: int) -> dict:
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
            "path": str(source_root),
            "branch_at_import": branch,
            "commit_at_import": commit,
        },
        "canonical_source": {
            "kind": "markdown_bundles",
            "content_path": "content",
            "project_data_path": "project",
            "extracted_source_path": "extracts",
            "regulatory_source_path": "sources",
            "original_source_files_path": "source-files",
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
            "source_count": len(catalog.get("sources", [])),
            "copied_original_source_files": copied_source_files,
            "content_groups": sorted({doc.get("content_group") for doc in documents if doc.get("content_group")}),
            "content_types": sorted({doc.get("content_type") for doc in documents if doc.get("content_type")}),
        },
        "documents": documents,
    }


def import_workspace(source_root: Path, target_root: Path) -> dict:
    catalog_path = source_root / "_project" / "catalog.json"
    if not catalog_path.exists():
        raise SystemExit(f"Missing catalog: {catalog_path}")

    target_root.mkdir(parents=True, exist_ok=True)
    copied_dirs: dict[str, int] = {}
    for source_name, target_name in COPY_DIRS:
        copied_dirs[target_name] = copy_dir(source_root / source_name, target_root / target_name)

    catalog = read_json(catalog_path)
    source_files_root = target_root / "source-files"
    if source_files_root.exists():
        shutil.rmtree(source_files_root)
    copied_source_files = 0
    missing_sources: list[str] = []
    for source in catalog.get("sources", []):
        relative_path = str(source.get("path", ""))
        if not relative_path:
            continue
        if copy_source_file(source_root, source_files_root, relative_path):
            copied_source_files += 1
        else:
            missing_sources.append(relative_path)

    manifest = build_manifest(source_root, target_root, catalog, copied_source_files)
    manifest["import_summary"]["copied_workspace_files"] = copied_dirs
    manifest["import_summary"]["missing_original_source_files"] = missing_sources
    manifest["import_summary"]["seeded_workbook_sidecars"] = seed_workbook_sidecars(target_root)
    write_json(target_root / "workspace.json", manifest)

    audit_path = target_root / "audit" / "ledger.jsonl"
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    if not audit_path.exists():
        audit_path.write_text("", encoding="utf-8")

    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Path to the original EPP repo.")
    parser.add_argument("--target", type=Path, default=DEFAULT_TARGET, help="Target Archivist workspace path.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest = import_workspace(args.source.expanduser().resolve(), args.target.expanduser().resolve())
    summary = manifest["import_summary"]
    print(
        "Imported {document_count} documents, {source_count} catalog sources, "
        "and {copied_original_source_files} original source files into {workspace_id}.".format(
            workspace_id=manifest["workspace_id"],
            **summary,
        )
    )


if __name__ == "__main__":
    main()
