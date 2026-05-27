# Senku Archivist

Local-first document workbench for reading, editing, reviewing, and eventually exporting structured document workspaces.

## Current Direction

Archivist is an app-first repo, not an EPP-only process repo. The EPP manual is the first serious workspace because it is complex enough to prove the system, but the app should stay capable of opening or packaging other document sets later.

The intended v1 shape:

- Vite-based browser app for the live local document experience.
- Local loopback service for filesystem access, workspace indexing, proposal state, and future export operations.
- Workspace abstraction so EPP content can be bundled, copied to coworkers, or replaced with other document collections.
- Proposal/review-first editing by default until a write/export posture is explicitly confirmed.

## Source Context

The original EPP implementation lives at:

`~/Dovaxis - DevOps/Emergency Prep Project`

The current useful pieces to preserve are the content model, local service behavior, proposal/review safety model, and complex EPP corpus. The generated static review browser should be treated as source evidence, not the new app architecture.

## Workspaces

This repo currently carries two EPP workspaces:

- `workspaces/epp-seed`: tiny scaffold fixture for fast app development.
- `workspaces/epp-full`: full imported EPP corpus for parity, renderer, compliance, artifact, and appendix edge cases.

Refresh the full EPP workspace from the original repo with:

```bash
npm run import:epp
```

The app-facing import target is canonical Markdown bundles, sanitized project metadata, retained app-facing extracted context, and regulatory sources used by CFR and Survey Guidance views. Normal import refresh builds and validates a non-app-facing staged candidate before promoting imported surfaces into the live `epp-full` workspace. Failed candidate import or validation leaves the live workspace usable and appends no success import audit event. Normal import refresh preserves app-owned audit, workbook, draft, and runtime state; it is not a destructive reset command. Successful refresh appends a sanitized import event to the audit ledger and prints a matching console summary, without retaining raw source paths or development-only source filenames. Original office/catalog source files under `workspaces/epp-full/source-files` are development-only manual-building references and should be physically absent from the refreshed app workspace. Development-only original source annotations under `workspaces/epp-full/extracts/source-annotations` should be absent or normalized without original `source_path` values. `workspaces/epp-full/project/catalog.json` is the normalized app-facing catalog; Archivist v1 should not retain a raw upstream catalog copy with development-only source file paths. Original catalog source records may remain only as non-browseable provenance stubs for traceability, without original file paths or open/download targets. All copied app-facing project metadata should be sanitized so development-only original source paths do not leak through crosswalk, search, compliance, source metadata, or service responses. App-facing provenance should keep source kind, branch, commit, and a non-browseable label without exposing absolute local source checkout paths. Import summaries should use explicit count fields for provenance-only source records and retained regulatory sources, not a generic `source_count`. A repeatable post-import leak check should fail on disallowed original-source markers while allowing retained regulatory source data, but it should not scan canonical Markdown document bodies. A post-cleanup reference-integrity check should fail on dangling references to removed source annotations, removed raw source paths, or missing source records. The generated review browser remains source evidence, not app architecture.

## Project Brain

Senku project-brain state for this repo lives under `.project-brain/`. JSON is canonical; Markdown files are human-readable orientation.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Vite app:

```bash
npm run dev
```

Open `http://127.0.0.1:5173/`.

Start the current loopback service boundary:

```bash
npm run service
```

The service listens on `http://127.0.0.1:8798/` and currently exposes workspace metadata endpoints.

Start the service and app together:

```bash
npm run launch
```

The desktop `Archivist` icon runs the same launcher. It starts the local service on
`127.0.0.1:8798`, starts the Vite app on `127.0.0.1:5173`, and opens the full EPP
workspace. Launcher logs are written under `.tmp/archivist-launch/`.

Useful launcher checks:

```bash
npm run launch:status
npm run launch:stop
```
