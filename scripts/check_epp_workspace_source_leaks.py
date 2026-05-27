#!/usr/bin/env python3
"""Fail if the app-facing EPP workspace leaks development-only source paths."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any


DEFAULT_SOURCE_ROOT = Path("~/Dovaxis - DevOps/Emergency Prep Project").expanduser()
TEXT_MARKERS = (
    ".docx",
    ".xlsx",
    ".xls",
    ".doc",
    "source-files",
    "original_source_files_path",
    "copied_original_source_files",
    "missing_original_source_files",
)
RAW_TARGET_KEYS = {
    "open_target",
    "download_target",
    "browse_target",
    "attachment_target",
    "open_path",
    "download_path",
    "browse_path",
    "attachment_path",
}
SCAN_SUFFIXES = {".json", ".jsonl", ".txt", ".md", ".xml", ".html"}
SECRET_PATTERNS = (
    ("Mapbox access token", re.compile(r"pk\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+){2}")),
)


def is_allowed_path(relative_path: Path) -> bool:
    parts = relative_path.parts
    if not parts:
        return False
    if parts[0] == "content":
        return True
    return len(parts) >= 2 and parts[0] == "sources" and parts[1] == "regulatory"


def iter_scan_files(workspace_root: Path) -> list[Path]:
    paths = []
    for path in sorted(workspace_root.rglob("*")):
        if not path.is_file():
            continue
        relative_path = path.relative_to(workspace_root)
        if is_allowed_path(relative_path):
            continue
        if path.suffix.lower() in SCAN_SUFFIXES:
            paths.append(path)
    return paths


def iter_text_files(workspace_root: Path) -> list[Path]:
    return [
        path
        for path in sorted(workspace_root.rglob("*"))
        if path.is_file() and path.suffix.lower() in SCAN_SUFFIXES
    ]


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return ""


def check_text_markers(path: Path, text: str, errors: list[str]) -> None:
    lowered = text.lower()
    for marker in TEXT_MARKERS:
        if marker in lowered:
            errors.append(f"{path}: contains disallowed marker {marker!r}")
    source_root = str(DEFAULT_SOURCE_ROOT)
    if source_root and source_root in text:
        errors.append(f"{path}: contains absolute original source checkout path")


def check_secret_patterns(path: Path, text: str, errors: list[str]) -> None:
    for label, pattern in SECRET_PATTERNS:
        if pattern.search(text):
            errors.append(f"{path}: contains disallowed {label}")


def walk_json(value: Any, path: Path, json_path: str, errors: list[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            lowered = key.lower()
            if lowered in RAW_TARGET_KEYS:
                errors.append(f"{path}:{json_path}.{key}: contains raw open/download/browse target field")
            walk_json(child, path, f"{json_path}.{key}", errors)
        return
    if isinstance(value, list):
        for index, child in enumerate(value):
            walk_json(child, path, f"{json_path}[{index}]", errors)


def check_json(path: Path, text: str, errors: list[str]) -> None:
    if path.suffix == ".jsonl":
        for line_number, line in enumerate(text.splitlines(), start=1):
            if not line.strip():
                continue
            try:
                walk_json(json.loads(line), path, f"line[{line_number}]", errors)
            except json.JSONDecodeError as error:
                errors.append(f"{path}:{line_number}: invalid JSONL: {error}")
        return
    if path.suffix == ".json":
        try:
            walk_json(json.loads(text), path, "$", errors)
        except json.JSONDecodeError as error:
            errors.append(f"{path}: invalid JSON: {error}")


def main() -> int:
    workspace_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path("workspaces/epp-full").resolve()
    if not (workspace_root / "workspace.json").exists():
        print(f"Missing workspace manifest: {workspace_root / 'workspace.json'}", file=sys.stderr)
        return 2

    errors: list[str] = []
    for path in iter_text_files(workspace_root):
        check_secret_patterns(path, read_text(path), errors)

    for path in iter_scan_files(workspace_root):
        text = read_text(path)
        check_text_markers(path, text, errors)
        check_json(path, text, errors)

    if errors:
        print("EPP source-leak check failed:")
        for error in errors[:200]:
            print(f"- {error}")
        if len(errors) > 200:
            print(f"- ... {len(errors) - 200} additional errors")
        return 1

    print(f"EPP source-leak check passed for {workspace_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
