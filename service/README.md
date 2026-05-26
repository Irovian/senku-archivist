# Archivist Local Service

This folder owns the loopback service boundary for filesystem, workspace, history, and future write/export operations.

The Vite app can start with bundled seed data, but accepted document writes should eventually flow through this service so Git commits and Archivist audit ledger events stay coordinated.

Initial intended endpoints:

- `GET /api/status`
- `GET /api/workspaces`
- `GET /api/workspaces/{workspace_id}`
- `GET /api/workspaces/{workspace_id}/workbooks`
- `GET /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=approved|draft`
- `PUT /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=draft`

Default local port: `127.0.0.1:8798`.

Workbook sidecar convention:

- Approved state: `workspaces/{workspace_id}/workbook-state/{document_id}/{workbook_id}/approved.json`
- Draft state: `workspaces/{workspace_id}/runtime/workbook-state/{document_id}/{workbook_id}/draft.json`

Approved state is intended to be tracked with workspace content. Draft state is runtime-local and ignored by Git until a future review/apply workflow promotes it.

Future endpoints should add document read/search, proposal queueing, approved apply, Git history, diff lookup, workbook approval, and export.
