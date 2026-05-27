#!/usr/bin/env python3
"""Minimal loopback Archivist service boundary."""

from __future__ import annotations

import json
import hashlib
import html
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
MANUAL_DRAFT_SOURCES = {"manual_edit", "model_proposal"}
MANUAL_DRAFT_STATUSES = {"pending", "rejected"}
WORKSPACE_ID = "epp-full"
LIBRARY_ORDER = ["epp", "survey-guidance", "cfr"]
LIBRARY_LABELS = {
    "epp": "Emergency Preparedness Program",
    "survey-guidance": "Survey Guidance",
    "cfr": "Code of Federal Regulations",
}
CONTENT_GROUP_FALLBACKS = {
    "incident-command": "all-hazards-response",
    "resources-and-lists": "resources-and-attachments",
}
APPENDIX_SUBGROUPS = {
    "DOC-APPENDICES-APPENDIX_A": "Risk, Compliance, and Review",
    "DOC-APPENDICES-APPENDIX_C": "Risk, Compliance, and Review",
    "DOC-APPENDICES-APPENDIX_I": "Risk, Compliance, and Review",
    "DOC-APPENDICES-APPENDIX_J": "Risk, Compliance, and Review",
    "DOC-APPENDICES-APPENDIX_B": "Agreements and Vendors",
    "DOC-APPENDICES-APPENDIX_D": "Agreements and Vendors",
    "DOC-APPENDICES-APPENDIX_G": "Communications and Contacts",
    "DOC-APPENDICES-APPENDIX_N": "Communications and Contacts",
    "DOC-APPENDICES-APPENDIX_O": "Communications and Contacts",
    "DOC-APPENDICES-APPENDIX_P": "Communications and Contacts",
    "DOC-APPENDICES-APPENDIX_H": "Training and Testing",
    "DOC-APPENDICES-APPENDIX_K": "Tools and Quick Reference",
    "DOC-APPENDICES-APPENDIX_M": "Tools and Quick Reference",
    "DOC-APPENDICES-APPENDIX_E": "Maps and Attachments",
    "DOC-APPENDICES-APPENDIX_L": "Regulatory and Waiver References",
}
PLACEHOLDER_TOKEN_RE = re.compile(r"(\{\{[^{}]+\}\}|PLH-[A-Z0-9_-]+)")
MARKDOWN_LINK_RE = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
CFR_CITATION_RE = re.compile(
    r"(?<![\w#/.-])((?:42 CFR\s+)?(?:§\s*)?(\d{3})\.(\d+(?:\.\d+)?)(?:\([a-z0-9]+\))*)"
)
INTERNAL_READER_SECTIONS = {
    "customization tokens",
    "working notes",
    "compliance references",
}


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


def text_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def workspace_dir(workspace_id: str) -> Path:
    return WORKSPACES_DIR / safe_id(workspace_id, "workspace_id")


def workspace_manifest(workspace_id: str) -> dict:
    return read_json(workspace_dir(workspace_id) / "workspace.json")


def project_json(workspace_id: str, filename: str, default: Any) -> Any:
    path = workspace_dir(workspace_id) / "project" / filename
    if not path.exists():
        return default
    return read_json(path)


def document_by_id(manifest: dict, document_id: str) -> dict | None:
    for document in manifest.get("documents", []):
        if document.get("doc_id") == document_id:
            return document
    return None


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "section"


def unique_anchor(text: str, used: dict[str, int]) -> str:
    base = slugify(text)
    count = used.get(base, 0)
    used[base] = count + 1
    if count:
        return f"{base}-{count + 1}"
    return base


def render_inline(text: str) -> str:
    escaped = html.escape(text)
    escaped = MARKDOWN_LINK_RE.sub(r'<a href="\2" target="_blank" rel="noreferrer">\1</a>', escaped)
    escaped = CFR_CITATION_RE.sub(cfr_citation_link, escaped)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", escaped)
    return PLACEHOLDER_TOKEN_RE.sub(r'<span class="placeholder-token">\1</span>', escaped)


def cfr_citation_link(match: re.Match[str]) -> str:
    citation = match.group(1)
    part = match.group(2)
    section = match.group(3).replace(".", "-")
    doc_id = f"REG-CFR-42-{part}-{section}"
    href = f"#/workspaces/{WORKSPACE_ID}/documents/{doc_id}"
    return f'<a class="cfr-inline-link" href="{href}">{citation}</a>'


def table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def looks_like_table_separator(line: str) -> bool:
    stripped = line.strip()
    if not stripped or "|" not in stripped:
        return False
    return all(set(cell.strip()) <= {"-", ":"} and "-" in cell for cell in stripped.strip("|").split("|"))


def artifact_placeholder_html(artifacts: list[dict]) -> str:
    if not artifacts:
        return ""
    items = []
    for artifact in artifacts:
        title = html.escape(str(artifact.get("title") or artifact.get("artifact_id") or "Artifact"))
        template = html.escape(str(artifact.get("renderer_template") or artifact.get("artifact_type") or "artifact"))
        items.append(f"<li><strong>{title}</strong><span>{template}</span></li>")
    return (
        '<section class="artifact-inline-placeholder" aria-label="Artifact placeholder">'
        "<h2>Linked Artifact</h2>"
        "<p>Structured artifact available from the entry point above.</p>"
        f"<ul>{''.join(items)}</ul>"
        "</section>"
    )


def truncate_plain(value: str, max_length: int) -> str:
    normalized = re.sub(r"\s+", " ", value).strip()
    if len(normalized) <= max_length:
        return normalized
    return f"{normalized[: max_length - 3].rstrip()}..."


def render_markdown(markdown: str, artifacts: list[dict], editable: bool = False) -> dict:
    parts: list[str] = []
    anchors: list[dict] = []
    edit_sections: list[dict] = []
    edit_blocks: list[dict] = []
    used_anchors: dict[str, int] = {}
    used_edit_sections: dict[str, int] = {}
    list_open = False
    ordered_list_open = False
    code_open = False
    in_artifact_block = False
    inserted_artifact_placeholder = False
    code_lines: list[str] = []
    lines = markdown.splitlines()
    index = 0
    open_structured_blocks: list[str] = []

    def close_lists() -> None:
        nonlocal list_open, ordered_list_open
        if list_open:
            parts.append("</ul>")
            list_open = False
        if ordered_list_open:
            parts.append("</ol>")
            ordered_list_open = False

    def close_structured_blocks() -> None:
        while open_structured_blocks:
            parts.append("</section>")
            open_structured_blocks.pop()

    open_edit_sections: list[dict[str, Any]] = []

    def close_edit_sections_until(level: int | None = None) -> None:
        while open_edit_sections and (level is None or int(open_edit_sections[-1]["level"]) >= level):
            parts.append("</section>")
            section = open_edit_sections.pop()
            section["original_text"] = "\n".join(section.pop("_text_parts", [])).strip()
            section["block_types"] = sorted(section.pop("_block_types", set()))

    def skip_section(start_index: int, level: int) -> int:
        next_index = start_index + 1
        while next_index < len(lines):
            next_heading = re.match(r"^(#{1,6})\s+(.+)$", lines[next_index].strip())
            if next_heading and len(next_heading.group(1)) <= level:
                break
            next_index += 1
        return next_index

    def start_edit_section(level: int, heading: str, visible_heading: bool = True) -> dict[str, Any]:
        validation: list[str] = []
        if level not in {2, 3, 4}:
            validation.append("Editable manual sections must use H2, H3, or H4 headings.")
        if level > 2 and not open_edit_sections:
            validation.append(f"H{level} section is missing its parent heading.")
        if level > 2 and open_edit_sections and int(open_edit_sections[-1]["level"]) != level - 1:
            validation.append(f"H{level} section must sit under an H{level - 1} heading.")
        if not heading.strip():
            validation.append("Editable manual sections require a heading.")

        section_id = f"section-{unique_anchor(heading, used_edit_sections)}"
        section = {
            "section_id": section_id,
            "level": level,
            "heading": heading,
            "original_text": "",
            "block_types": [],
            "validation_messages": validation,
            "_text_parts": [],
            "_block_types": set(),
        }
        edit_sections.append(section)
        open_edit_sections.append(section)
        classes = "editable-section" if visible_heading else "editable-section implicit"
        parts.append(
            f'<section class="{classes}" data-edit-section-id="{html.escape(section_id)}"'
            f' data-edit-section-level="{level}" data-edit-section-heading="{html.escape(heading)}">'
        )
        return section

    def ensure_implicit_edit_section(seed_text: str) -> dict[str, Any] | None:
        if not editable:
            return None
        if open_edit_sections:
            return open_edit_sections[-1]
        heading = truncate_plain(seed_text, 52) or "Introduction"
        return start_edit_section(2, heading, visible_heading=False)

    def record_edit_child(block_type: str, text: str) -> str:
        if not editable:
            return ""
        if not open_edit_sections:
            ensure_implicit_edit_section(text)
        if not open_edit_sections:
            return ""
        for section in open_edit_sections:
            section["_block_types"].add(block_type)
            section["_text_parts"].append(text)
        child_id = f"{open_edit_sections[-1]['section_id']}-{block_type}"
        edit_blocks.append(
            {
                "block_id": child_id,
                "block_type": block_type,
                "original_text": text,
            }
        )
        return (
            f' data-edit-section-child="true" data-edit-section-id="{html.escape(str(open_edit_sections[-1]["section_id"]))}"'
            f' data-edit-block-type="{html.escape(block_type)}"'
        )

    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        if in_artifact_block:
            if stripped.startswith("```"):
                in_artifact_block = False
                if not inserted_artifact_placeholder:
                    placeholder = artifact_placeholder_html(artifacts)
                    if placeholder:
                        parts.append(placeholder)
                    inserted_artifact_placeholder = True
            index += 1
            continue

        if stripped.startswith("```epp-artifact"):
            close_lists()
            close_edit_sections_until()
            in_artifact_block = True
            index += 1
            continue

        if stripped.startswith("```"):
            close_lists()
            close_edit_sections_until()
            if code_open:
                parts.append(f"<pre><code>{html.escape(chr(10).join(code_lines))}</code></pre>")
                code_lines = []
                code_open = False
            else:
                code_open = True
            index += 1
            continue

        if code_open:
            code_lines.append(line)
            index += 1
            continue

        if not stripped:
            close_lists()
            index += 1
            continue

        structured_start = re.match(r"^<!--\s*(assembly|regulatory-segment):([A-Za-z0-9_-]+)\s+start\s*-->$", stripped)
        if structured_start:
            close_lists()
            close_edit_sections_until()
            block_kind = structured_start.group(1)
            block_id = structured_start.group(2)
            class_name = "assembly-block" if block_kind == "assembly" else "regulatory-segment-block"
            label = "Assembly block" if block_kind == "assembly" else "Regulatory segment"
            parts.append(
                f'<section class="{class_name}" data-block-id="{html.escape(block_id)}" aria-label="{label}">'
            )
            open_structured_blocks.append(block_kind)
            index += 1
            continue

        structured_end = re.match(r"^<!--\s*(assembly|regulatory-segment):([A-Za-z0-9_-]+)\s+end\s*-->$", stripped)
        if structured_end:
            close_lists()
            if open_structured_blocks:
                parts.append("</section>")
                open_structured_blocks.pop()
            index += 1
            continue

        if stripped.startswith("<!--") and stripped.endswith("-->"):
            index += 1
            continue

        if "|" in stripped and index + 1 < len(lines) and looks_like_table_separator(lines[index + 1]):
            close_lists()
            headers = table_cells(stripped)
            index += 2
            rows = []
            while index < len(lines) and "|" in lines[index].strip() and lines[index].strip():
                rows.append(table_cells(lines[index]))
                index += 1
            head_html = "".join(f"<th>{render_inline(cell)}</th>" for cell in headers)
            row_html = "".join(
                "<tr>" + "".join(f"<td>{render_inline(cell)}</td>" for cell in row) + "</tr>" for row in rows
            )
            parts.append(f"<table><thead><tr>{head_html}</tr></thead><tbody>{row_html}</tbody></table>")
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading_match:
            close_lists()
            level = min(len(heading_match.group(1)), 4)
            text = heading_match.group(2).strip()
            if level == 1:
                close_edit_sections_until()
                anchor_id = unique_anchor(text, used_anchors)
                anchors.append({"id": anchor_id, "label": text, "level": level})
                parts.append(f'<span id="{anchor_id}" class="reader-title-anchor" aria-hidden="true"></span>')
                index += 1
                continue
            close_edit_sections_until(level)
            if text.strip().lower() in INTERNAL_READER_SECTIONS:
                index = skip_section(index, level)
                continue
            anchor_id = unique_anchor(text, used_anchors)
            anchors.append({"id": anchor_id, "label": text, "level": level})
            if editable:
                start_edit_section(level, text)
            parts.append(
                f'<h{level} id="{anchor_id}" class="editable-section-heading"'
                f'{record_edit_child(f"h{level}", text)}>{render_inline(text)}</h{level}>'
            )
            index += 1
            continue

        unordered_match = re.match(r"^[-*]\s+(.+)$", stripped)
        if unordered_match:
            if ordered_list_open:
                parts.append("</ol>")
                ordered_list_open = False
            if not list_open:
                parts.append("<ul>")
                list_open = True
            item_text = unordered_match.group(1)
            parts.append(f"<li{record_edit_child('li', item_text)}>{render_inline(item_text)}</li>")
            index += 1
            continue

        ordered_match = re.match(r"^\d+\.\s+(.+)$", stripped)
        if ordered_match:
            if list_open:
                parts.append("</ul>")
                list_open = False
            if not ordered_list_open:
                parts.append("<ol>")
                ordered_list_open = True
            item_text = ordered_match.group(1)
            parts.append(f"<li{record_edit_child('li', item_text)}>{render_inline(item_text)}</li>")
            index += 1
            continue

        close_lists()
        if stripped.startswith(">"):
            record_edit_child("blockquote", stripped.lstrip("> ").strip())
            parts.append(f'<blockquote>{render_inline(stripped.lstrip("> ").strip())}</blockquote>')
        elif stripped == "---":
            close_edit_sections_until()
            parts.append("<hr>")
        else:
            paragraph = [stripped]
            index += 1
            while index < len(lines):
                next_line = lines[index].strip()
                if (
                    not next_line
                    or next_line.startswith("#")
                    or next_line.startswith("```")
                    or next_line.startswith("<!--")
                    or re.match(r"^[-*]\s+", next_line)
                    or re.match(r"^\d+\.\s+", next_line)
                ):
                    break
                paragraph.append(next_line)
                index += 1
            paragraph_text = " ".join(paragraph)
            parts.append(f"<p{record_edit_child('p', paragraph_text)}>{render_inline(paragraph_text)}</p>")
            continue
        index += 1

    close_lists()
    close_edit_sections_until()
    close_structured_blocks()
    if code_open:
        parts.append(f"<pre><code>{html.escape(chr(10).join(code_lines))}</code></pre>")
    for section in edit_sections:
        section.pop("_text_parts", None)
        section.pop("_block_types", None)
    return {"html": "\n".join(parts), "anchors": anchors, "edit_sections": edit_sections, "edit_blocks": edit_blocks}


def requirements_by_id(workspace_id: str) -> dict[str, dict]:
    payload = project_json(workspace_id, "requirements.json", {"requirements": []})
    requirements = payload.get("requirements", []) if isinstance(payload, dict) else []
    return {
        str(requirement.get("requirement_id")): {
            "requirement_id": requirement.get("requirement_id"),
            "citation": requirement.get("citation"),
            "e_tags": requirement.get("e_tags", []),
            "applicability": requirement.get("applicability"),
            "summary": requirement.get("summary"),
        }
        for requirement in requirements
        if requirement.get("requirement_id")
    }


def artifacts_by_doc_id(workspace_id: str) -> dict[str, list[dict]]:
    payload = project_json(workspace_id, "artifact_index_seed.json", {"artifacts": []})
    artifacts = payload.get("artifacts", []) if isinstance(payload, dict) else []
    by_doc: dict[str, list[dict]] = {}
    for artifact in artifacts:
        if not isinstance(artifact, dict) or not artifact.get("doc_id"):
            continue
        artifact_payload = artifact.get("artifact_payload") if isinstance(artifact.get("artifact_payload"), dict) else {}
        summary = {
            "artifact_id": artifact.get("artifact_id"),
            "doc_id": artifact.get("doc_id"),
            "title": artifact.get("title"),
            "artifact_type": artifact.get("artifact_type"),
            "renderer_template": artifact.get("renderer_template"),
            "render_intent": artifact.get("render_intent", {}),
            "placeholder_ids": artifact.get("placeholder_ids", []),
            "review_questions": artifact.get("review_questions", []),
            "context": {
                "intro": artifact_payload.get("intro", {}),
                "methodology": artifact_payload.get("methodology", {}),
                "workflow_steps": artifact_payload.get("workflow_steps", []),
                "hazard_categories": artifact_payload.get("hazard_categories", []),
                "print_rules": artifact.get("print_rules", []),
            },
        }
        by_doc.setdefault(str(artifact.get("doc_id")), []).append(summary)
    return by_doc


def browser_nav_overrides(workspace_id: str) -> dict:
    payload = project_json(workspace_id, "browser_nav_overrides.json", {})
    return payload if isinstance(payload, dict) else {}


def group_catalog(workspace_id: str) -> tuple[dict[str, dict], dict[str, list[str]]]:
    overrides = browser_nav_overrides(workspace_id)
    groups = {
        str(group.get("id")): {
            "id": group.get("id"),
            "label": group.get("label"),
            "order": group.get("order", 999),
        }
        for group in overrides.get("groups", [])
        if isinstance(group, dict) and group.get("id")
    }
    groups.setdefault(
        "other-imported-documents",
        {"id": "other-imported-documents", "label": "Other Imported Documents", "order": 999},
    )
    subgroups = {
        str(group_id): list(values)
        for group_id, values in overrides.get("subgroups", {}).items()
        if isinstance(values, list)
    }
    return groups, subgroups


def nav_group_for_document(document: dict, overrides: dict) -> str:
    document_id = str(document.get("doc_id", ""))
    override = overrides.get("overrides", {}).get(document_id, {})
    if isinstance(override, dict) and override.get("nav_group"):
        return str(override["nav_group"])
    if document.get("content_type") == "regulatory_cfr":
        return "cfr-title-42"
    if document.get("content_group") == "regulatory":
        return "som-appendix-z"
    content_group = str(document.get("content_group") or "other-imported-documents")
    return CONTENT_GROUP_FALLBACKS.get(content_group, content_group)


def library_for_group(group_id: str) -> str:
    if group_id == "cfr-title-42":
        return "cfr"
    if group_id == "som-appendix-z":
        return "survey-guidance"
    return "epp"


def cfr_subgroup(document: dict) -> str:
    match = re.search(r"REG-CFR-42-(\d+)-", str(document.get("doc_id", "")))
    if match:
        return f"42 CFR Part {match.group(1)}"
    return "Title 42 CFR"


def nav_subgroup_for_document(document: dict, group_id: str, overrides: dict) -> str:
    document_id = str(document.get("doc_id", ""))
    override = overrides.get("overrides", {}).get(document_id, {})
    if isinstance(override, dict) and override.get("nav_subgroup"):
        return str(override["nav_subgroup"])
    if group_id == "cfr-title-42":
        return cfr_subgroup(document)
    if group_id == "som-appendix-z":
        if document.get("content_type") == "regulatory_etag":
            return "E-Tags"
        return "Support Sections"
    if group_id == "appendices":
        return APPENDIX_SUBGROUPS.get(document_id, "Tools and Quick Reference")
    if document.get("content_type") == "support_artifact":
        return "Reference Attachments"
    return "Documents"


def navigation_payload(workspace_id: str) -> dict:
    manifest = workspace_manifest(workspace_id)
    overrides = browser_nav_overrides(workspace_id)
    groups, subgroups = group_catalog(workspace_id)
    artifacts = artifacts_by_doc_id(workspace_id)
    group_buckets: dict[str, dict] = {}
    document_index: dict[str, dict] = {}

    for manifest_order, document in enumerate(manifest.get("documents", [])):
        document_id = document.get("doc_id")
        if not document_id:
            continue
        group_id = nav_group_for_document(document, overrides)
        if group_id not in groups:
            group_id = "other-imported-documents"
        library_id = library_for_group(group_id)
        subgroup = nav_subgroup_for_document(document, group_id, overrides)
        group = groups[group_id]
        bucket = group_buckets.setdefault(
            group_id,
            {
                "id": group_id,
                "label": group.get("label", group_id.replace("-", " ").title()),
                "order": group.get("order", 999),
                "library_id": library_id,
                "subgroup_order": subgroups.get(group_id, []),
                "documents": [],
            },
        )
        nav_document = {
            "doc_id": document_id,
            "title": document.get("title"),
            "library_id": library_id,
            "group_id": group_id,
            "group_label": bucket["label"],
            "subgroup": subgroup,
            "content_group": document.get("content_group"),
            "content_type": document.get("content_type"),
            "lifecycle_status": document.get("lifecycle_status"),
            "editable": bool(document.get("editable")),
            "source_count": len(document.get("source_ids", [])),
            "requirement_count": len(document.get("requirement_ids", [])),
            "placeholder_count": len(document.get("placeholder_ids", [])),
            "artifact_count": len(artifacts.get(str(document_id), [])),
            "_manifest_order": manifest_order,
        }
        bucket["documents"].append(nav_document)
        document_index[str(document_id)] = {
            "title": document.get("title"),
            "library_id": library_id,
            "group_id": group_id,
            "subgroup": subgroup,
        }

    libraries = []
    for library_id in LIBRARY_ORDER:
        library_groups = [group for group in group_buckets.values() if group["library_id"] == library_id]
        for group in library_groups:
            subgroup_order = {name: order for order, name in enumerate(group.pop("subgroup_order", []))}
            group["documents"].sort(
                key=lambda item: (
                    subgroup_order.get(item.get("subgroup"), 999),
                    str(item.get("subgroup", "")),
                    item.get("_manifest_order", 99999),
                    str(item.get("title", "")),
                )
            )
            for document in group["documents"]:
                document.pop("_manifest_order", None)
            group["count"] = len(group["documents"])
        library_groups.sort(key=lambda group: (group.get("order", 999), str(group.get("label", ""))))
        default_document_id = None
        if library_groups:
            first_documents = library_groups[0].get("documents", [])
            default_document_id = first_documents[0].get("doc_id") if first_documents else None
        libraries.append(
            {
                "id": library_id,
                "label": LIBRARY_LABELS[library_id],
                "count": sum(group.get("count", 0) for group in library_groups),
                "default_document_id": default_document_id,
                "groups": library_groups,
            }
        )

    default_document_id = libraries[0].get("default_document_id") or next(iter(document_index), None)
    return {
        "schema_version": "archivist-navigation/v1",
        "workspace_id": workspace_id,
        "default_document_id": default_document_id,
        "document_count": len(document_index),
        "libraries": libraries,
        "document_index": document_index,
    }


def source_orientation(document: dict) -> list[dict]:
    sources = []
    for source_id in document.get("source_ids", []):
        label = str(source_id).removeprefix("SRC-").replace("_", " ").title()
        sources.append({"source_id": source_id, "label": label})
    return sources


def document_payload(workspace_id: str, document_id: str) -> dict:
    manifest = workspace_manifest(workspace_id)
    document = document_by_id(manifest, document_id)
    if not document:
        raise KeyError(document_id)
    requirements = requirements_by_id(workspace_id)
    artifacts = artifacts_by_doc_id(workspace_id).get(document_id, [])
    document_path = workspace_dir(workspace_id) / str(document.get("path", ""))
    missing = not document_path.exists()
    if missing:
        markdown = (
            f"# {document.get('title', document_id)}\n\n"
            "This imported document is listed in the workspace manifest, but its canonical Markdown file is not "
            "present in this local workspace snapshot."
        )
    else:
        markdown = document_path.read_text(encoding="utf-8")
    editable = bool(document.get("editable"))
    rendered = render_markdown(markdown, artifacts, editable=editable)
    requirement_refs = [
        requirements.get(str(requirement_id), {"requirement_id": requirement_id})
        for requirement_id in document.get("requirement_ids", [])
    ]
    return {
        "schema_version": "archivist-document/v1",
        "workspace_id": workspace_id,
        "doc_id": document_id,
        "title": document.get("title"),
        "metadata": {
            "content_group": document.get("content_group"),
            "content_type": document.get("content_type"),
            "lifecycle_status": document.get("lifecycle_status"),
            "editable": editable,
            "placeholder_ids": document.get("placeholder_ids", []),
            "source_ids": document.get("source_ids", []),
            "requirement_ids": document.get("requirement_ids", []),
            "missing_markdown": missing,
            "source_hash": text_hash(markdown),
        },
        "rendered": {
            "format": "html",
            "html": rendered["html"],
            "anchors": rendered["anchors"],
            "edit_sections": rendered.get("edit_sections", []),
            "edit_blocks": rendered.get("edit_blocks", []),
        },
        "source_orientation": source_orientation(document),
        "compliance_orientation": requirement_refs,
        "artifacts": artifacts,
    }


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


def manual_draft_state_path(workspace_id: str, document_id: str) -> Path:
    safe_workspace_id = safe_id(workspace_id, "workspace_id")
    safe_document_id = safe_id(document_id, "document_id")
    return workspace_dir(safe_workspace_id) / "runtime" / "manual-drafts" / safe_document_id / "drafts.json"


def editable_document(workspace_id: str, document_id: str) -> dict:
    manifest = workspace_manifest(workspace_id)
    document = document_by_id(manifest, document_id)
    if not document:
        raise KeyError(document_id)
    if not bool(document.get("editable")):
        raise PermissionError("Static or regulatory documents cannot be edited.")
    return document


def empty_manual_draft_state(workspace_id: str, document_id: str) -> dict:
    document = editable_document(workspace_id, document_id)
    document_path = workspace_dir(workspace_id) / str(document.get("path", ""))
    markdown = document_path.read_text(encoding="utf-8") if document_path.exists() else ""
    now = utc_now()
    return {
        "schema_version": "archivist-manual-drafts/v1",
        "workspace_id": workspace_id,
        "document_id": document_id,
        "source_hash": text_hash(markdown),
        "status": "draft",
        "drafts": [],
        "audit": {
            "created_at": now,
            "updated_at": now,
            "created_by": "archivist-service",
            "apply_status": "review_required",
            "linked_commit": None,
        },
    }


def normalized_manual_draft_state(workspace_id: str, document_id: str, payload: dict[str, Any]) -> dict:
    state = empty_manual_draft_state(workspace_id, document_id)
    if isinstance(payload.get("source_hash"), str):
        state["source_hash"] = payload["source_hash"]
    if isinstance(payload.get("audit"), dict):
        state["audit"].update(payload["audit"])
    drafts = []
    for draft in payload.get("drafts", []):
        if not isinstance(draft, dict):
            continue
        section_id = str(draft.get("section_id") or draft.get("block_id") or "").strip()
        section_heading = str(draft.get("section_heading") or draft.get("heading") or "")
        block_id = str(draft.get("block_id") or section_id).strip()
        block_type = str(draft.get("block_type") or draft.get("section_type") or "section").strip()
        section_level_raw = draft.get("section_level", draft.get("level", 2))
        try:
            section_level = int(section_level_raw)
        except (TypeError, ValueError):
            section_level = 2
        original_text = str(draft.get("original_text", ""))
        draft_text = str(draft.get("draft_text", ""))
        source = str(draft.get("source", "manual_edit"))
        status = str(draft.get("status", "pending"))
        if not section_id:
            continue
        if source not in MANUAL_DRAFT_SOURCES:
            source = "manual_edit"
        if status not in MANUAL_DRAFT_STATUSES:
            status = "pending"
        validation_messages = draft.get("validation_messages", [])
        if not isinstance(validation_messages, list):
            validation_messages = []
        validation_messages = [str(message) for message in validation_messages if str(message).strip()]
        now = utc_now()
        drafts.append(
            {
                "draft_id": str(draft.get("draft_id") or f"{source}-{section_id}"),
                "section_id": section_id,
                "section_level": section_level,
                "section_heading": section_heading,
                "block_id": block_id,
                "block_type": block_type,
                "original_text": original_text,
                "draft_text": draft_text,
                "validation_messages": validation_messages,
                "source": source,
                "status": status,
                "created_at": str(draft.get("created_at") or now),
                "updated_at": now,
            }
        )
    state["drafts"] = drafts
    state["audit"]["updated_at"] = utc_now()
    state["workspace_id"] = workspace_id
    state["document_id"] = document_id
    return state


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
        origin = self.headers.get("Origin", "")
        if origin.startswith("http://127.0.0.1:") or origin.startswith("http://localhost:"):
            self.send_header("Access-Control-Allow-Origin", origin)
        else:
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

    def handle_manual_draft_get(self, parts: list[str]) -> bool:
        if len(parts) != 5 or parts[:2] != ["api", "workspaces"] or parts[3] != "manual-drafts":
            return False
        workspace_id = parts[2]
        document_id = parts[4]
        try:
            state_path = manual_draft_state_path(workspace_id, document_id)
            if not (workspace_dir(workspace_id) / "workspace.json").exists():
                self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
                return True
            if state_path.exists():
                data = read_json(state_path)
                self.send_json(
                    200,
                    {"ok": True, "data": data, "meta": {"exists": True, "path": str(state_path.relative_to(ROOT))}},
                )
                return True
            data = empty_manual_draft_state(workspace_id, document_id)
        except KeyError:
            self.send_json(404, {"ok": False, "error": {"message": "Document not found."}})
            return True
        except PermissionError as error:
            self.send_json(409, {"ok": False, "error": {"message": str(error)}})
            return True
        except ValueError as error:
            self.send_json(400, {"ok": False, "error": {"message": str(error)}})
            return True
        self.send_json(
            200,
            {"ok": True, "data": data, "meta": {"exists": False, "path": str(state_path.relative_to(ROOT))}},
        )
        return True

    def handle_manual_draft_put(self, parts: list[str]) -> bool:
        if len(parts) != 5 or parts[:2] != ["api", "workspaces"] or parts[3] != "manual-drafts":
            return False
        workspace_id = parts[2]
        document_id = parts[4]
        try:
            state_path = manual_draft_state_path(workspace_id, document_id)
            payload = self.read_body_json()
            state = normalized_manual_draft_state(workspace_id, document_id, payload)
            write_json(state_path, state)
        except KeyError:
            self.send_json(404, {"ok": False, "error": {"message": "Document not found."}})
            return True
        except PermissionError as error:
            self.send_json(409, {"ok": False, "error": {"message": str(error)}})
            return True
        except ValueError as error:
            self.send_json(400, {"ok": False, "error": {"message": str(error)}})
            return True
        except json.JSONDecodeError:
            self.send_json(400, {"ok": False, "error": {"message": "Request body must be valid JSON."}})
            return True
        self.send_json(
            200,
            {"ok": True, "data": state, "meta": {"exists": True, "path": str(state_path.relative_to(ROOT))}},
        )
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
        if len(parts) == 4 and parts[:2] == ["api", "workspaces"] and parts[3] == "navigation":
            workspace_id = parts[2]
            if not (workspace_dir(workspace_id) / "workspace.json").exists():
                self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
                return
            self.send_json(200, {"ok": True, "data": navigation_payload(workspace_id)})
            return
        if len(parts) == 5 and parts[:2] == ["api", "workspaces"] and parts[3] == "documents":
            workspace_id = parts[2]
            document_id = parts[4]
            if not (workspace_dir(workspace_id) / "workspace.json").exists():
                self.send_json(404, {"ok": False, "error": {"message": "Workspace not found."}})
                return
            try:
                self.send_json(200, {"ok": True, "data": document_payload(workspace_id, document_id)})
            except KeyError:
                self.send_json(404, {"ok": False, "error": {"message": "Document not found."}})
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
        if self.handle_manual_draft_get(parts):
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
        if self.handle_manual_draft_put(parts):
            return
        self.send_json(404, {"ok": False, "error": {"message": "Endpoint not found."}})


def main() -> None:
    port = int(os.environ.get("ARCHIVIST_SERVICE_PORT", "8798"))
    server = ThreadingHTTPServer(("127.0.0.1", port), ArchivistHandler)
    print(f"Archivist local service listening on http://127.0.0.1:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
