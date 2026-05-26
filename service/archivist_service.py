#!/usr/bin/env python3
"""Minimal loopback Archivist service boundary."""

from __future__ import annotations

import json
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
WORKSPACES_DIR = ROOT / "workspaces"
SAFE_ID_RE = re.compile(r"^[A-Za-z0-9_.-]+$")
STATE_STATUSES = {"approved", "draft"}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def safe_id(value: str, label: str) -> str:
    if not value or not SAFE_ID_RE.fullmatch(value):
        raise ValueError(f"Invalid {label}.")
    return value


def utc_now() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def workspace_dir(workspace_id: str) -> Path:
    return WORKSPACES_DIR / safe_id(workspace_id, "workspace_id")


def workbook_state_path(workspace_id: str, document_id: str, workbook_id: str, status: str) -> Path:
    safe_workspace_id = safe_id(workspace_id, "workspace_id")
    safe_document_id = safe_id(document_id, "document_id")
    safe_workbook_id = safe_id(workbook_id, "workbook_id")
    if status not in STATE_STATUSES:
        raise ValueError("Invalid workbook state status.")
    base_dir = workspace_dir(safe_workspace_id)
    if status == "approved":
        return base_dir / "workbook-state" / safe_document_id / safe_workbook_id / "approved.json"
    return base_dir / "runtime" / "workbook-state" / safe_document_id / safe_workbook_id / "draft.json"


def artifact_workbooks(workspace_id: str) -> list[dict]:
    artifact_index_path = workspace_dir(workspace_id) / "project" / "artifact_index_seed.json"
    if not artifact_index_path.exists():
        return []
    artifacts = read_json(artifact_index_path).get("artifacts", [])
    workbooks = []
    for artifact in artifacts:
        artifact_type = str(artifact.get("artifact_type", ""))
        renderer_template = str(artifact.get("renderer_template", ""))
        if "workbook" in artifact_type or "workbook" in renderer_template:
            workbooks.append(
                {
                    "workbook_id": artifact.get("artifact_id"),
                    "parent_document_id": artifact.get("doc_id"),
                    "title": artifact.get("title"),
                    "artifact_type": artifact.get("artifact_type"),
                    "renderer_template": artifact.get("renderer_template"),
                    "render_intent": artifact.get("render_intent", {}),
                    "review_questions": artifact.get("review_questions", []),
                }
            )
    return workbooks


def workbook_metadata(workspace_id: str, document_id: str, workbook_id: str) -> dict:
    for workbook in artifact_workbooks(workspace_id):
        if workbook.get("parent_document_id") == document_id and workbook.get("workbook_id") == workbook_id:
            return workbook
    return {
        "workbook_id": workbook_id,
        "parent_document_id": document_id,
        "title": None,
        "artifact_type": "workbook",
        "renderer_template": None,
    }


def empty_workbook_state(workspace_id: str, document_id: str, workbook_id: str, status: str) -> dict:
    workbook = workbook_metadata(workspace_id, document_id, workbook_id)
    return {
        "schema_version": "archivist-workbook-state/v1",
        "workspace_id": workspace_id,
        "parent_document_id": document_id,
        "workbook_id": workbook_id,
        "artifact_type": workbook.get("artifact_type"),
        "renderer_template": workbook.get("renderer_template"),
        "status": status,
        "state_payload": {},
        "derived_outputs": {},
        "validation": {
            "status": "not_validated",
            "messages": [],
        },
        "audit": {
            "created_at": utc_now(),
            "updated_at": utc_now(),
            "created_by": "archivist-service",
            "approved_at": None,
            "approved_by": None,
            "linked_commit": None,
        },
    }


def normalized_workbook_state(
    workspace_id: str,
    document_id: str,
    workbook_id: str,
    status: str,
    payload: dict[str, Any],
) -> dict:
    state = empty_workbook_state(workspace_id, document_id, workbook_id, status)
    if isinstance(payload, dict):
        if isinstance(payload.get("state_payload"), dict):
            state["state_payload"] = payload["state_payload"]
        elif isinstance(payload.get("payload"), dict):
            state["state_payload"] = payload["payload"]
        if isinstance(payload.get("derived_outputs"), dict):
            state["derived_outputs"] = payload["derived_outputs"]
        if isinstance(payload.get("validation"), dict):
            state["validation"] = payload["validation"]
        if isinstance(payload.get("audit"), dict):
            state["audit"].update(payload["audit"])
    state["workspace_id"] = workspace_id
    state["parent_document_id"] = document_id
    state["workbook_id"] = workbook_id
    state["status"] = status
    state["audit"]["updated_at"] = utc_now()
    return state


def workspace_manifests() -> list[dict]:
    manifests: list[dict] = []
    for manifest_path in sorted(WORKSPACES_DIR.glob("*/workspace.json")):
        manifest = read_json(manifest_path)
        manifests.append(
            {
                "workspace_id": manifest.get("workspace_id"),
                "name": manifest.get("name"),
                "description": manifest.get("description"),
                "document_count": len(manifest.get("documents", [])),
                "canonical_source": manifest.get("canonical_source", {}),
                "history": manifest.get("history", {}),
            }
        )
    return manifests


class ArchivistHandler(BaseHTTPRequestHandler):
    server_version = "ArchivistLocalService/0.1"

    def log_message(self, format: str, *args: object) -> None:
        return

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, indent=2, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body_json(self) -> dict:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            return {}
        raw_body = self.rfile.read(content_length)
        return json.loads(raw_body.decode("utf-8"))

    def route_parts(self) -> tuple[list[str], dict[str, list[str]]]:
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.strip("/").split("/") if part]
        return parts, parse_qs(parsed.query)

    def handle_workbook_state_get(self, parts: list[str], query: dict[str, list[str]]) -> bool:
        if len(parts) != 7 or parts[:2] != ["api", "workspaces"] or parts[3] != "workbooks" or parts[6] != "state":
            return False
        workspace_id = parts[2]
        document_id = parts[4]
        workbook_id = parts[5]
        status = query.get("status", ["approved"])[0]
        try:
            state_path = workbook_state_path(workspace_id, document_id, workbook_id, status)
        except ValueError as error:
            self.send_json(400, {"ok": False, "error": {"message": str(error)}})
            return True
        if not (workspace_dir(workspace_id) / "workspace.json").exists():
            self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
            return True
        if state_path.exists():
            data = read_json(state_path)
            self.send_json(200, {"ok": True, "data": data, "meta": {"exists": True, "path": str(state_path.relative_to(ROOT))}})
            return True
        data = empty_workbook_state(workspace_id, document_id, workbook_id, status)
        self.send_json(200, {"ok": True, "data": data, "meta": {"exists": False, "path": str(state_path.relative_to(ROOT))}})
        return True

    def handle_workbook_state_put(self, parts: list[str], query: dict[str, list[str]]) -> bool:
        if len(parts) != 7 or parts[:2] != ["api", "workspaces"] or parts[3] != "workbooks" or parts[6] != "state":
            return False
        workspace_id = parts[2]
        document_id = parts[4]
        workbook_id = parts[5]
        status = query.get("status", ["draft"])[0]
        if status == "approved":
            self.send_json(
                409,
                {
                    "ok": False,
                    "error": {
                        "message": "Approved workbook state writes must go through a future review/apply workflow."
                    },
                },
            )
            return True
        try:
            state_path = workbook_state_path(workspace_id, document_id, workbook_id, status)
            payload = self.read_body_json()
            state = normalized_workbook_state(workspace_id, document_id, workbook_id, status, payload)
            write_json(state_path, state)
        except ValueError as error:
            self.send_json(400, {"ok": False, "error": {"message": str(error)}})
            return True
        except json.JSONDecodeError:
            self.send_json(400, {"ok": False, "error": {"message": "Request body must be valid JSON."}})
            return True
        self.send_json(200, {"ok": True, "data": state, "meta": {"path": str(state_path.relative_to(ROOT))}})
        return True

    def do_GET(self) -> None:
        parts, query = self.route_parts()
        parsed = urlparse(self.path)
        if parsed.path == "/api/status":
            self.send_json(
                200,
                {
                    "ok": True,
                    "data": {
                        "local_only": True,
                        "service": "archivist-local-service",
                        "history_model": "git_plus_archivist_ledger",
                        "workspace_count": len(workspace_manifests()),
                    },
                },
            )
            return
        if parsed.path == "/api/workspaces":
            self.send_json(200, {"ok": True, "data": workspace_manifests()})
            return
        if len(parts) == 4 and parts[:2] == ["api", "workspaces"] and parts[3] == "workbooks":
            workspace_id = parts[2]
            if not (workspace_dir(workspace_id) / "workspace.json").exists():
                self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
                return
            self.send_json(200, {"ok": True, "data": artifact_workbooks(workspace_id)})
            return
        if self.handle_workbook_state_get(parts, query):
            return
        if parsed.path.startswith("/api/workspaces/"):
            workspace_id = unquote(parsed.path.removeprefix("/api/workspaces/")).strip("/")
            manifest_path = workspace_dir(workspace_id) / "workspace.json"
            if not manifest_path.exists():
                self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
                return
            self.send_json(200, {"ok": True, "data": read_json(manifest_path)})
            return
        self.send_json(404, {"ok": False, "error": {"message": "Endpoint not found."}})

    def do_PUT(self) -> None:
        parts, query = self.route_parts()
        if self.handle_workbook_state_put(parts, query):
            return
        self.send_json(404, {"ok": False, "error": {"message": "Endpoint not found."}})


def main() -> None:
    port = int(os.environ.get("ARCHIVIST_SERVICE_PORT", "8798"))
    server = ThreadingHTTPServer(("127.0.0.1", port), ArchivistHandler)
    print(f"Archivist local service listening on http://127.0.0.1:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
