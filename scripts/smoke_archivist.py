#!/usr/bin/env python3
"""Local Archivist service and browser smoke harness."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import socket
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from service.archivist_service import render_markdown

SERVICE_PORT = 8798
APP_PORT = 5173
SERVICE_BASE_URL = f"http://127.0.0.1:{SERVICE_PORT}"
APP_BASE_URL = f"http://127.0.0.1:{APP_PORT}"
EVIDENCE_ROOT = ROOT / ".tmp" / "archivist-smoke"
VIEWPORT = "1440,1000"
CHROME_VIRTUAL_TIME_MS = "5000"

DEFAULT_DOC_ID = "DOC-GOVERNANCE_AND_PLANNING-POLICY_AND_ORGANIZATIONAL_STATEMENTS"
APPENDIX_A_DOC_ID = "DOC-APPENDICES-APPENDIX_A"
SURVEY_DOC_ID = "REG-SOMZ-E-0001"
CFR_DOC_ID = "REG-CFR-42-483-73"
MISSING_DOC_ID = "DOC-EVACUATION-EVACUATION_FLOOR_PLANS"
PLACEHOLDER_HEAVY_DOC_ID = "DOC-ALL_HAZARDS_RESPONSE-ACTIVATION_OF_EMERGENCY_OPERATIONS_PLAN_EOP"
ASSEMBLY_DOC_ID = "DOC-ALL_HAZARDS_RESPONSE-INTERNAL_COMMUNICATIONS_DURING_A_DISASTER"
HIERARCHY_DOC_ID = "DOC-GOVERNANCE_AND_PLANNING-CONTINUITY_OF_OPERATIONS"


class EditSectionContractParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.stack: list[str] = []
        self.edit_depth = 0
        self.static_depth = 0
        self.nested_edit_sections = 0
        self.static_edit_hooks = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {name: value or "" for name, value in attrs}
        classes = set(attr_map.get("class", "").split())
        is_edit_section = tag == "section" and "editable-section" in classes
        is_static = attr_map.get("contenteditable") == "false" or bool(
            classes & {"assembly-block", "regulatory-segment-block", "artifact-inline-placeholder"}
        )
        if self.static_depth and attr_map.get("data-edit-section-child") == "true":
            self.static_edit_hooks += 1
        if is_edit_section:
            if self.edit_depth:
                self.nested_edit_sections += 1
            self.edit_depth += 1
            self.stack.append("edit")
            return
        if is_static:
            self.static_depth += 1
            self.stack.append("static")
            return
        self.stack.append("")

    def handle_endtag(self, tag: str) -> None:
        if not self.stack:
            return
        kind = self.stack.pop()
        if kind == "edit":
            self.edit_depth = max(0, self.edit_depth - 1)
        elif kind == "static":
            self.static_depth = max(0, self.static_depth - 1)


class SmokeError(RuntimeError):
    """Raised when a smoke expectation fails."""


@dataclass
class ManagedProcess:
    name: str
    args: list[str]
    log_path: Path
    env: dict[str, str] | None = None
    process: subprocess.Popen[bytes] | None = None
    log_file: Any = None

    def start(self) -> None:
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self.log_file = self.log_path.open("ab")
        self.process = subprocess.Popen(
            self.args,
            cwd=ROOT,
            env=self.env,
            stdout=self.log_file,
            stderr=subprocess.STDOUT,
        )

    def stop(self) -> None:
        if not self.process:
            return
        if self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=8)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=8)
        if self.log_file:
            self.log_file.close()
            self.log_file = None


def utc_run_id(prefix: str) -> str:
    now = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return f"{prefix}-{now}"


def json_dump(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")


def http_get_json(path_or_url: str, timeout: float = 5.0) -> dict[str, Any]:
    url = path_or_url if path_or_url.startswith("http") else f"{SERVICE_BASE_URL}{path_or_url}"
    request = Request(url, headers={"Accept": "application/json"})
    with urlopen(request, timeout=timeout) as response:
        raw = response.read()
    return json.loads(raw.decode("utf-8"))


def write_json_request(path_or_url: str, payload: dict[str, Any], timeout: float = 5.0) -> dict[str, Any]:
    url = path_or_url if path_or_url.startswith("http") else f"{SERVICE_BASE_URL}{path_or_url}"
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        url,
        data=body,
        method="PUT",
        headers={"Accept": "application/json", "Content-Type": "application/json"},
    )
    with urlopen(request, timeout=timeout) as response:
        raw = response.read()
    return json.loads(raw.decode("utf-8"))


def url_ready(url: str, timeout: float = 0.75) -> bool:
    try:
        with urlopen(url, timeout=timeout) as response:
            return response.status < 500
    except Exception:
        return False


def port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex(("127.0.0.1", port)) == 0


def wait_until_ready(url: str, label: str, timeout: float = 20.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if url_ready(url):
            return
        time.sleep(0.25)
    raise SmokeError(f"{label} did not become ready at {url}")


def wait_until_unavailable(url: str, label: str, timeout: float = 8.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if not url_ready(url):
            return
        time.sleep(0.25)
    raise SmokeError(f"{label} stayed available at {url}")


def start_service(evidence_dir: Path, require_owned: bool) -> ManagedProcess | None:
    status_url = f"{SERVICE_BASE_URL}/api/status"
    if url_ready(status_url):
        if require_owned:
            raise SmokeError(
                f"Archivist service is already running on {SERVICE_BASE_URL}; stop it before browser smoke."
            )
        return None
    if port_open(SERVICE_PORT):
        raise SmokeError(f"Port {SERVICE_PORT} is in use but {status_url} is not healthy.")
    env = os.environ.copy()
    env["ARCHIVIST_SERVICE_PORT"] = str(SERVICE_PORT)
    process = ManagedProcess(
        "archivist-service",
        [sys.executable, "service/archivist_service.py"],
        evidence_dir / "service.log",
        env=env,
    )
    process.start()
    wait_until_ready(status_url, "Archivist service")
    return process


def start_app(evidence_dir: Path) -> ManagedProcess | None:
    app_url = f"{APP_BASE_URL}/"
    if url_ready(app_url):
        return None
    if port_open(APP_PORT):
        raise SmokeError(f"Port {APP_PORT} is in use but {app_url} is not healthy.")
    process = ManagedProcess(
        "vite-app",
        ["npm", "run", "dev", "--", "--port", str(APP_PORT)],
        evidence_dir / "vite.log",
    )
    process.start()
    wait_until_ready(app_url, "Vite app")
    return process


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SmokeError(message)


def assert_edit_section_contract(label: str, rendered: dict[str, Any]) -> None:
    html = str(rendered.get("html", ""))
    edit_sections = rendered.get("edit_sections", [])
    require(isinstance(edit_sections, list), f"{label} edit_sections was not a list")
    parser = EditSectionContractParser()
    parser.feed(html)
    require(parser.nested_edit_sections == 0, f"{label} rendered nested editable sections")
    require(parser.static_edit_hooks == 0, f"{label} rendered editable child hooks inside static blocks")
    require(
        html.count('<section class="editable-section') == len(edit_sections),
        f"{label} editable wrapper count did not match edit_sections metadata",
    )
    for section in edit_sections:
        require(section.get("section_id"), f"{label} edit section was missing section_id")
        require(section.get("level") in {2, 3, 4}, f"{label} edit section had invalid heading level")
        require(str(section.get("heading", "")).strip(), f"{label} edit section was missing heading")
        require(str(section.get("original_text", "")).strip(), f"{label} edit section was missing original_text")
        require(
            str(section.get("original_text", "")).lstrip().startswith("#" * int(section.get("level", 2))),
            f"{label} edit section original_text did not preserve heading structure",
        )


def assert_renderer_fixture_contract() -> None:
    fixture_markdown = """# Fixture

## Parent Section
Editable parent paragraph.

<!-- assembly:ASM-FIXTURE start -->
Static assembly text.
### Static Assembly Heading
- Static assembly bullet.
<!-- assembly:ASM-FIXTURE end -->

More editable parent text.

### Child Section
Child paragraph.

#### Grandchild Section
Grandchild paragraph.

```epp-artifact
artifact_id: fixture
```

```
static code
```

| A | B |
| - | - |
| 1 | 2 |
"""
    rendered = render_markdown(
        fixture_markdown,
        [{"artifact_id": "fixture", "title": "Fixture Artifact", "renderer_template": "fixture-tool"}],
        editable=True,
    )
    assert_edit_section_contract("renderer fixture", rendered)
    edit_sections = rendered.get("edit_sections", [])
    require(
        [section.get("level") for section in edit_sections] == [2, 3, 4],
        "renderer fixture did not preserve H2/H3/H4 editable section metadata",
    )
    html = str(rendered.get("html", ""))
    require('class="assembly-block"' in html and 'contenteditable="false"' in html, "assembly block was not static")
    require(
        'class="artifact-inline-placeholder"' in html and 'contenteditable="false"' in html,
        "artifact placeholder was not static",
    )
    require("<pre contenteditable=\"false\">" in html, "code block was not static")
    require("<table contenteditable=\"false\">" in html, "table block was not static")


def ensure_no_source_leaks(label: str, payload: Any) -> None:
    text = json.dumps(payload, ensure_ascii=True)
    blocked = [
        "source-files",
        '"source_path"',
        "/home/irovian/Dovaxis",
        "staging-import",
        ".import-stage",
    ]
    found = [marker for marker in blocked if marker in text]
    require(not found, f"{label} exposed blocked source/staging markers: {', '.join(found)}")


def data_from_envelope(path: str) -> dict[str, Any]:
    payload = http_get_json(path)
    require(payload.get("ok") is True, f"{path} did not return ok=true")
    data = payload.get("data")
    require(isinstance(data, dict), f"{path} did not return an object data payload")
    ensure_no_source_leaks(path, payload)
    return data


def run_service_smoke(evidence_dir: Path) -> dict[str, Any]:
    started_service = start_service(evidence_dir, require_owned=False)
    checks: list[str] = []
    try:
        assert_renderer_fixture_contract()
        checks.append("renderer edit-section contract")

        status_payload = http_get_json("/api/status")
        require(status_payload.get("ok") is True, "status endpoint did not return ok=true")
        status = status_payload.get("data", {})
        require(status.get("service") == "archivist-local-service", "status did not identify Archivist service")
        checks.append("status")

        workspaces_payload = http_get_json("/api/workspaces")
        require(workspaces_payload.get("ok") is True, "workspace list did not return ok=true")
        workspaces = workspaces_payload.get("data", [])
        require(isinstance(workspaces, list), "workspace list data is not an array")
        workspace_ids = sorted(str(workspace.get("workspace_id")) for workspace in workspaces)
        require("epp-full" in workspace_ids, "epp-full workspace was not discoverable")
        require("epp-seed" in workspace_ids, "epp-seed fixture workspace was not discoverable")
        require(
            not any("stage" in workspace_id.lower() or "tmp" in workspace_id.lower() for workspace_id in workspace_ids),
            f"workspace discovery exposed a staging candidate: {workspace_ids}",
        )
        ensure_no_source_leaks("/api/workspaces", workspaces_payload)
        checks.append("workspace discovery")

        epp_full = data_from_envelope("/api/workspaces/epp-full")
        require(epp_full.get("workspace_id") == "epp-full", "epp-full manifest had the wrong workspace id")
        require(len(epp_full.get("documents", [])) == 261, "epp-full manifest did not expose 261 documents")
        checks.append("epp-full manifest")

        epp_seed = data_from_envelope("/api/workspaces/epp-seed")
        require(epp_seed.get("workspace_id") == "epp-seed", "epp-seed manifest had the wrong workspace id")
        require(len(epp_seed.get("documents", [])) > 0, "epp-seed fixture has no documents")
        checks.append("epp-seed fixture")

        navigation = data_from_envelope("/api/workspaces/epp-full/navigation")
        require(navigation.get("document_count") == 261, "navigation did not report 261 documents")
        libraries = {library["id"]: library for library in navigation.get("libraries", [])}
        expected_counts = {"epp": 177, "survey-guidance": 52, "cfr": 32}
        for library_id, expected_count in expected_counts.items():
            require(library_id in libraries, f"{library_id} library was missing")
            require(
                libraries[library_id].get("count") == expected_count,
                f"{library_id} library count was {libraries[library_id].get('count')}, expected {expected_count}",
            )
        document_index = navigation.get("document_index", {})
        for doc_id in [
            DEFAULT_DOC_ID,
            APPENDIX_A_DOC_ID,
            SURVEY_DOC_ID,
            CFR_DOC_ID,
            ASSEMBLY_DOC_ID,
            HIERARCHY_DOC_ID,
            MISSING_DOC_ID,
        ]:
            require(doc_id in document_index, f"{doc_id} was missing from navigation")
        checks.append("navigation")

        document_checks = {
            DEFAULT_DOC_ID: {"title": "Policy and Organizational Statements", "type": "topic_document"},
            APPENDIX_A_DOC_ID: {"title": "Appendix A - Hazard Vulnerability Assessment", "type": "appendix"},
            SURVEY_DOC_ID: {"title": "E-0001 Regulatory Reference", "type": "regulatory_etag"},
            CFR_DOC_ID: {"title": "42 CFR", "type": "regulatory_cfr"},
            ASSEMBLY_DOC_ID: {"title": "Internal Communications During a Disaster", "type": "topic_document"},
            HIERARCHY_DOC_ID: {"title": "Continuity of Operations", "type": "topic_document"},
        }
        for doc_id, expectation in document_checks.items():
            document = data_from_envelope(f"/api/workspaces/epp-full/documents/{doc_id}")
            html = document.get("rendered", {}).get("html", "")
            anchors = document.get("rendered", {}).get("anchors", [])
            edit_sections = document.get("rendered", {}).get("edit_sections", [])
            metadata = document.get("metadata", {})
            require(document.get("doc_id") == doc_id, f"{doc_id} returned the wrong doc_id")
            require(expectation["title"] in document.get("title", ""), f"{doc_id} returned the wrong title")
            require(metadata.get("content_type") == expectation["type"], f"{doc_id} returned the wrong content type")
            require(document.get("rendered", {}).get("format") == "html", f"{doc_id} did not return html format")
            require("<h1" in html or "<h2" in html, f"{doc_id} did not include rendered heading html")
            require("```" not in html[:500], f"{doc_id} looked like raw Markdown instead of rendered html")
            require(isinstance(anchors, list) and anchors, f"{doc_id} did not include stable anchors")
            if metadata.get("editable") and edit_sections:
                assert_edit_section_contract(doc_id, document.get("rendered", {}))
            if doc_id == DEFAULT_DOC_ID:
                require(isinstance(edit_sections, list) and edit_sections, f"{doc_id} did not expose edit sections")
                require("data-edit-section-id" in html, f"{doc_id} did not render editable section hooks")
                require(
                    any(section.get("level") in {2, 3, 4} for section in edit_sections),
                    f"{doc_id} did not expose structured heading levels",
                )
                for internal_heading in ["Customization Tokens", "Working Notes", "Compliance References"]:
                    require(internal_heading not in html, f"{doc_id} exposed internal reader section: {internal_heading}")
            if doc_id == HIERARCHY_DOC_ID:
                headings = {str(section.get("heading", "")) for section in edit_sections}
                require("Outpatient Service Referral Arrangements" not in headings, f"{doc_id} made assembly H3 editable")
                require(
                    not any(heading.startswith("When ") or heading.startswith("Residents receiving") for heading in headings),
                    f"{doc_id} made assembly body content editable",
                )
                service_section = next(
                    (section for section in edit_sections if section.get("heading") == "Service Continuity Approach"),
                    None,
                )
                require(service_section is not None, f"{doc_id} did not expose Service Continuity Approach section")
                original_text = str(service_section.get("original_text", ""))
                require("If a needed service cannot be continued" in original_text, f"{doc_id} lost editable text after static assembly blocks")
                require("mutual aid plan" not in original_text.lower(), f"{doc_id} included static assembly text in editable draft text")
            if doc_id == SURVEY_DOC_ID:
                require("regulatory-segment-block" in html, f"{doc_id} did not preserve regulatory segment blocks")
            if doc_id == CFR_DOC_ID:
                require("cfr-inline-link" in html, f"{doc_id} did not render inline CFR links")
            if doc_id == ASSEMBLY_DOC_ID:
                require("assembly-block" in html, f"{doc_id} did not preserve assembly blocks")
            checks.append(f"document {doc_id}")

        appendix_a = data_from_envelope(f"/api/workspaces/epp-full/documents/{APPENDIX_A_DOC_ID}")
        require(appendix_a.get("source_orientation"), "Appendix A did not include source orientation")
        require(appendix_a.get("compliance_orientation"), "Appendix A did not include compliance orientation")
        artifacts = appendix_a.get("artifacts", [])
        require(artifacts and artifacts[0].get("renderer_template") == "hva-workbook-v1", "Appendix A HVA artifact missing")
        checks.append("appendix artifact context")

        missing_doc = data_from_envelope(f"/api/workspaces/epp-full/documents/{MISSING_DOC_ID}")
        require(missing_doc.get("metadata", {}).get("missing_markdown") is True, "missing document flag was not set")
        require(
            "canonical Markdown file is not present" in missing_doc.get("rendered", {}).get("html", ""),
            "missing document did not return a clear fallback payload",
        )
        checks.append("missing Markdown fallback")

        default_document = data_from_envelope(f"/api/workspaces/epp-full/documents/{DEFAULT_DOC_ID}")
        first_section = default_document.get("rendered", {}).get("edit_sections", [])[0]
        draft_path = f"/api/workspaces/epp-full/manual-drafts/{DEFAULT_DOC_ID}"
        empty_draft_state = data_from_envelope(draft_path)
        require(empty_draft_state.get("schema_version") == "archivist-manual-drafts/v1", "manual draft schema mismatch")
        manual_draft_payload = {
            "source_hash": default_document.get("metadata", {}).get("source_hash"),
            "drafts": [
                {
                    "draft_id": f"manual_edit-{first_section['section_id']}",
                    "section_id": first_section["section_id"],
                    "section_level": first_section["level"],
                    "section_heading": first_section["heading"],
                    "block_id": first_section["section_id"],
                    "block_type": f"h{first_section['level']}",
                    "original_text": first_section["original_text"],
                    "draft_text": f"{first_section['original_text']} Smoke draft.",
                    "validation_messages": first_section.get("validation_messages", []),
                    "source": "manual_edit",
                    "status": "pending",
                },
                {
                    "draft_id": f"model_proposal-{first_section['section_id']}",
                    "section_id": first_section["section_id"],
                    "section_level": first_section["level"],
                    "section_heading": first_section["heading"],
                    "block_id": first_section["section_id"],
                    "block_type": f"h{first_section['level']}",
                    "original_text": first_section["original_text"],
                    "draft_text": f"{first_section['original_text']} Smoke proposal.",
                    "validation_messages": first_section.get("validation_messages", []),
                    "source": "model_proposal",
                    "status": "pending",
                },
            ],
        }
        write_json_request(draft_path, manual_draft_payload)
        saved_draft_state = data_from_envelope(draft_path)
        require(len(saved_draft_state.get("drafts", [])) == 2, "manual draft state did not persist both drafts")
        require(
            {draft.get("source") for draft in saved_draft_state.get("drafts", [])} == {"manual_edit", "model_proposal"},
            "manual draft state did not keep manual/proposal sources distinct",
        )
        write_json_request(draft_path, {"source_hash": default_document.get("metadata", {}).get("source_hash"), "drafts": []})
        checks.append("manual draft sidecar")

        summary = {
            "ok": True,
            "mode": "service",
            "service_base_url": SERVICE_BASE_URL,
            "workspace_ids": workspace_ids,
            "checks": checks,
        }
        json_dump(evidence_dir / "service-summary.json", summary)
        return summary
    finally:
        if started_service:
            started_service.stop()


def chrome_binary() -> str:
    for candidate in ["google-chrome", "chromium", "chromium-browser"]:
        path = shutil.which(candidate)
        if path:
            return path
    raise SmokeError("No headless Chrome binary found; expected google-chrome, chromium, or chromium-browser.")


def route_url(doc_id: str, demo_mode: str | None = None, smoke_mode: str | None = None) -> str:
    params = {}
    if demo_mode:
        params["archivist-demo"] = demo_mode
    if smoke_mode:
        params["archivist-smoke"] = smoke_mode
    query = f"?{urlencode(params)}" if params else ""
    return f"{APP_BASE_URL}/{query}#/workspaces/epp-full/documents/{doc_id}"


def run_chrome(chrome: str, args: list[str], timeout: int = 45) -> subprocess.CompletedProcess[str]:
    command = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size={VIEWPORT}",
        f"--virtual-time-budget={CHROME_VIRTUAL_TIME_MS}",
        *args,
    ]
    completed = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=timeout)
    if completed.returncode != 0:
        raise SmokeError(
            f"Chrome command failed with exit {completed.returncode}: {' '.join(command)}\n{completed.stderr}"
        )
    return completed


def dump_dom(chrome: str, url: str) -> str:
    completed = run_chrome(chrome, ["--dump-dom", url])
    return completed.stdout


def screenshot(chrome: str, url: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    run_chrome(chrome, [f"--screenshot={path}", url])
    require(path.exists() and path.stat().st_size > 10_000, f"Screenshot was not written or was unexpectedly small: {path}")


def assert_dom_markers(label: str, dom: str, markers: list[str]) -> None:
    missing = [marker for marker in markers if marker not in dom]
    require(not missing, f"{label} DOM was missing markers: {', '.join(missing)}")


def assert_dom_absent(label: str, dom: str, markers: list[str]) -> None:
    found = [marker for marker in markers if marker in dom]
    require(not found, f"{label} DOM included removed markers: {', '.join(found)}")


def run_browser_smoke(evidence_dir: Path) -> dict[str, Any]:
    chrome = chrome_binary()
    service = start_service(evidence_dir, require_owned=True)
    app = start_app(evidence_dir)
    screenshots: dict[str, str] = {}
    seeded_draft_path = f"/api/workspaces/epp-full/manual-drafts/{PLACEHOLDER_HEAVY_DOC_ID}"
    seeded_draft_hash = ""
    routes = {
        "default-epp": {
            "url": route_url(DEFAULT_DOC_ID),
            "markers": [
                "Emergency Preparedness Program",
                "DOVAXIS",
                "Governance and Planning",
                "Policy and Organizational Statements",
                "Review handle",
                "Compliance",
            ],
        },
        "appendix-a": {
            "url": route_url(APPENDIX_A_DOC_ID),
            "markers": [
                "Emergency Preparedness Program",
                "Appendices",
                "Appendix A - Hazard Vulnerability Assessment",
                "Open Workbook",
                "Hva Workbook V1",
            ],
        },
        "placeholder-heavy": {
            "url": route_url(PLACEHOLDER_HEAVY_DOC_ID),
            "markers": [
                "Activation of Emergency Operations Plan",
                "emergency_code_alert",
                "code_alert_has_been_provided_sample",
                "Review handle",
            ],
            "absent_markers": [
                "## Purpose",
                "Browser smoke manual draft",
            ],
        },
        "survey-guidance": {
            "url": route_url(SURVEY_DOC_ID),
            "markers": [
                "Survey Guidance",
                "E-0001 Regulatory Reference",
                "Source Header",
            ],
        },
        "cfr": {
            "url": route_url(CFR_DOC_ID),
            "markers": [
                "Code of Federal Regulations",
                "42 CFR",
                "Emergency preparedness",
                "Section Text",
            ],
        },
        "agent-panel": {
            "url": route_url(PLACEHOLDER_HEAVY_DOC_ID, "agent"),
            "markers": [
                "Assistant",
                "Local workspace",
                "Local model ready",
                "manual_markdown",
            ],
        },
        "edit-mode": {
            "url": route_url(PLACEHOLDER_HEAVY_DOC_ID, "edit"),
            "markers": [
                "Editable section preview",
                "Edit section handle",
                "Edit section",
                "manual-section-selected",
                "data-edit-section-id",
            ],
            "absent_markers": [
                "manual-edit-outline",
                "manual-selected-block",
                "Inline edit toolbar",
                "Heading 2",
                "Bold selected text",
                "## Purpose",
                "Browser smoke manual draft",
            ],
        },
        "draft-review-lens": {
            "url": route_url(PLACEHOLDER_HEAVY_DOC_ID, "draft-review"),
            "markers": [
                "Draft change",
                "Draft version",
                "Original version",
                "Draft review probe",
                "Browser smoke manual draft",
            ],
        },
        "edit-switch-autosave": {
            "url": route_url(PLACEHOLDER_HEAVY_DOC_ID, "edit", "edit-switch"),
            "markers": [
                "Single active editor smoke",
                "single-active-editor passed",
                "editable-caret collapsed",
                "Browser smoke switched section autosave",
                "Inline edit toolbar",
                "Heading 2",
                "Bold selected text",
                "data-active-edit-section-id",
                "data-editor-transition-state=\"idle\"",
            ],
            "absent_markers": [
                "single-active-editor failed",
                "data-editor-transition-state=\"saving\"",
            ],
        },
    }
    try:
        draft_document = data_from_envelope(f"/api/workspaces/epp-full/documents/{PLACEHOLDER_HEAVY_DOC_ID}")
        draft_sections = draft_document.get("rendered", {}).get("edit_sections", [])
        require(isinstance(draft_sections, list) and draft_sections, "browser smoke document exposed no editable sections")
        draft_section = next(
            (
                section
                for section in draft_sections
                if "p" in section.get("block_types", [])
            ),
            draft_sections[0],
        )
        require(isinstance(draft_section, dict), "browser smoke could not find editable draft section")
        seeded_draft_hash = str(draft_document.get("metadata", {}).get("source_hash", ""))
        write_json_request(
            seeded_draft_path,
            {
                "source_hash": seeded_draft_hash,
                "drafts": [
                    {
                        "draft_id": f"manual_edit-{draft_section['section_id']}",
                        "section_id": draft_section["section_id"],
                        "section_level": draft_section["level"],
                        "section_heading": draft_section["heading"],
                        "block_id": draft_section["section_id"],
                        "block_type": f"h{draft_section['level']}",
                        "original_text": draft_section["original_text"],
                        "draft_text": f"{draft_section['original_text']}\n\nBrowser smoke manual draft.",
                        "validation_messages": draft_section.get("validation_messages", []),
                        "source": "manual_edit",
                        "status": "pending",
                    }
                ],
            },
        )

        for label, route in routes.items():
            dom = dump_dom(chrome, route["url"])
            assert_dom_markers(label, dom, route["markers"])
            assert_dom_absent(label, dom, route.get("absent_markers", []))
            image_path = evidence_dir / "screenshots" / f"{label}.png"
            screenshot(chrome, route["url"], image_path)
            screenshots[label] = str(image_path.relative_to(ROOT))

        if service:
            service.stop()
            service = None
        wait_until_unavailable(f"{SERVICE_BASE_URL}/api/status", "Archivist service")
        service_required_url = route_url(APPENDIX_A_DOC_ID)
        dom = dump_dom(chrome, service_required_url)
        assert_dom_markers("service-required", dom, ["Service Required", "Retry", "Failed to fetch"])
        service_required_path = evidence_dir / "screenshots" / "service-required.png"
        screenshot(chrome, service_required_url, service_required_path)
        screenshots["service-required"] = str(service_required_path.relative_to(ROOT))

        summary = {
            "ok": True,
            "mode": "browser",
            "chrome": chrome,
            "viewport": VIEWPORT,
            "app_base_url": APP_BASE_URL,
            "service_base_url": SERVICE_BASE_URL,
            "screenshots": screenshots,
        }
        json_dump(evidence_dir / "browser-summary.json", summary)
        return summary
    finally:
        if seeded_draft_hash and url_ready(f"{SERVICE_BASE_URL}/api/status"):
            try:
                write_json_request(seeded_draft_path, {"source_hash": seeded_draft_hash, "drafts": []}, timeout=2.0)
            except Exception:
                pass
        if service:
            service.stop()
        if app:
            app.stop()


def run(args: argparse.Namespace) -> dict[str, Any]:
    run_id = args.run_id or utc_run_id(args.mode)
    evidence_dir = EVIDENCE_ROOT / run_id
    evidence_dir.mkdir(parents=True, exist_ok=True)
    commands = []
    results: dict[str, Any] = {
        "ok": True,
        "run_id": run_id,
        "mode": args.mode,
        "evidence_dir": str(evidence_dir.relative_to(ROOT)),
        "service_base_url": SERVICE_BASE_URL,
        "app_base_url": APP_BASE_URL,
        "commands": commands,
        "results": {},
    }

    if args.mode in {"service", "all"}:
        commands.append("python3 scripts/smoke_archivist.py --mode service")
        results["results"]["service"] = run_service_smoke(evidence_dir)
    if args.mode in {"browser", "all"}:
        commands.append("python3 scripts/smoke_archivist.py --mode browser")
        results["results"]["browser"] = run_browser_smoke(evidence_dir)

    json_dump(evidence_dir / "summary.json", results)
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Run local Archivist smoke checks.")
    parser.add_argument("--mode", choices=["service", "browser", "all"], default="all")
    parser.add_argument("--run-id", help="Optional evidence run id.")
    args = parser.parse_args()

    try:
        summary = run(args)
    except SmokeError as error:
        print(f"SMOKE FAILED: {error}", file=sys.stderr)
        return 1
    print(json.dumps(summary, indent=2, ensure_ascii=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
