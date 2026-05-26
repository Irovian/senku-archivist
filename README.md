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

The importer copies canonical Markdown bundles, project metadata, extracted source context, regulatory sources, and original catalog source files when available. It does not copy the generated review browser as app architecture.

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
