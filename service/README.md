# Archivist Local Service

This folder owns the loopback service boundary for filesystem, workspace, history, and future write/export operations.

The Vite app can keep bundled seed data as a development fixture, but the primary EPP browser should require this service. If the service is unavailable, the app should show a clear service-required state instead of silently falling back to seed data. Accepted document writes should eventually flow through this service so Git commits and Archivist audit ledger events stay coordinated.

Initial intended endpoints:

- `GET /api/status`
- `GET /api/workspaces`
- `GET /api/workspaces/{workspace_id}`
- `GET /api/workspaces/{workspace_id}/navigation`
- `GET /api/workspaces/{workspace_id}/documents/{doc_id}`
- `GET /api/workspaces/{workspace_id}/workbooks`
- `GET /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=approved|draft`
- `PUT /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=draft`

Default local port: `127.0.0.1:8798`.

Document-read responses should return browser-ready rendered compatibility output from current canonical source, not only raw Markdown. The payload should include sanitized document metadata, stable anchor data, source/compliance orientation, and artifact placeholder/context data so React can own shell, navigation, selected state, filtering, and controls without rebuilding the full old renderer in the first browser slice.

Workbook sidecar convention:

- Approved state: `workspaces/{workspace_id}/workbook-state/{document_id}/{workbook_id}/approved.json`
- Draft state: `workspaces/{workspace_id}/runtime/workbook-state/{document_id}/{workbook_id}/draft.json`

Approved state is intended to be tracked with workspace content. Draft state is runtime-local and ignored by Git until a future review/apply workflow promotes it.

Normal EPP import refresh should build and validate a non-app-facing staged candidate before promoting imported surfaces into the live workspace. Failed candidate import or validation should leave the live workspace usable and append no success import audit event. The service should not expose staging candidates through workspace discovery. Normal refresh should preserve the audit ledger, approved workbook sidecars, draft workbook state, and runtime data. Missing sidecars may be seeded only non-destructively; destructive reset should be a separate explicit workflow. Successful refresh should append a sanitized import event to the audit ledger without raw source paths, development-only source filenames, browse targets, or download targets.

Future endpoints should add document read/search, proposal queueing, approved apply, Git history, diff lookup, workbook approval, and export.
