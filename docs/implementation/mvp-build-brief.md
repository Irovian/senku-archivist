# MVP Build Brief

## Goal

Build the first runnable Archivist shell as a Vite-based local document app with a clear workspace boundary.

The product target is desktop-only local use. The port target includes the old EPP Markdown/browser functionality, compliance/regulatory navigation, artifact rendering, and local chat/manual-agent workflows.

## Recommended First Slice

1. Create a Vite app shell for the document workbench.
2. Add a minimal local service boundary for workspace metadata and future filesystem operations.
3. Define a workspace manifest shape that can describe EPP without hardcoding EPP as the only possible workspace.
4. Define the history/audit contract as Git-backed document history plus an Archivist audit ledger.
5. Seed the app with a tiny EPP-derived fixture or imported manifest before migrating the full corpus.
6. Preserve proposal/review-first write behavior for automated or model-assisted changes.
7. Move workspace/document reads behind the local service before implementing approved writes.
8. Port old EPP behavior by parity milestones rather than copying the generated browser shell.

## Non-Goals

- Full EPP content migration.
- Full replacement of the generated static browser.
- Final export generation.
- Unattended model apply.
- Cloud or multi-user sync.
- Replacing Git with a custom version-control implementation.
- Building the full history browser before the scaffold can read a workspace.
- Mobile-first or mobile-responsive product work.

## Validation

- Senku Prep project-brain validation passes.
- Vite build passes after scaffold exists.
- Local app opens directly to a workbench-style document browser surface.
