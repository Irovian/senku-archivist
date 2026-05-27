# SG-0013 Build Checklist: Full EPP Browser Shell And Navigation

## Artifact Role

This is the implementation checklist for `SG-0013`. It is not a separate Senku canonical artifact type; the canonical state remains the backlog item, decision records, requirements, questions, and session record under `.project-brain/`.

Use this checklist as the build-prep handoff for restoring the full EPP browser shell, service-backed reads, full navigation, and Appendix A visibility.

## Source Inputs

- `.project-brain/backlog/items/SG-0013.json`
- `.project-brain/backlog/items/SG-0007.json`
- `.project-brain/decisions/DEC-SG-0011.json`
- `.project-brain/decisions/DEC-SG-0012.json`
- `.project-brain/decisions/DEC-SG-0014.json`
- `.project-brain/decisions/DEC-SG-0015.json`
- `.project-brain/decisions/DEC-SG-0019.json`
- `.project-brain/decisions/DEC-SG-0020.json`
- `.project-brain/decisions/DEC-SG-0021.json`
- `.project-brain/decisions/DEC-SG-0022.json`
- `.project-brain/decisions/DEC-SG-0023.json`
- `.project-brain/decisions/DEC-SG-0024.json`
- `.project-brain/decisions/DEC-SG-0025.json`
- `.project-brain/decisions/DEC-SG-0026.json`
- `.project-brain/decisions/DEC-SG-0027.json`
- `.project-brain/decisions/DEC-SG-0028.json`
- `.project-brain/decisions/DEC-SG-0029.json`
- `.project-brain/decisions/DEC-SG-0030.json`
- `.project-brain/decisions/DEC-SG-0031.json`
- `.project-brain/decisions/DEC-SG-0032.json`
- `.project-brain/decisions/DEC-SG-0033.json`
- `.project-brain/decisions/DEC-SG-0034.json`
- `docs/architecture/epp-browser-ui-parity-contract.md`
- `docs/architecture/markdown-viewer-editing-contract.md`
- `workspaces/epp-full/workspace.json`
- `workspaces/epp-full/project/`

Old-browser source evidence:

- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/index.html`
- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_framework/scripts/prepare_manual_browser.py`
- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/nav-audit.md`

## Guardrails

- Complete `SG-0007` before starting this slice so the app-facing `epp-full` workspace has been refreshed with development-only `source-files` physically absent.
- Assume `workspaces/epp-full/project/catalog.json` is normalized app-facing metadata; do not read from or expose a raw upstream catalog copy.
- Assume all app-facing project metadata has been sanitized; do not read from or expose unsanitized crosswalk, source, search, or compliance metadata carrying development-only original source paths.
- Require the SG-0007 post-import leak check to pass before treating `epp-full` service responses as ready for browser work.
- Require SG-0007 normal import refresh to preserve app-owned audit ledger, workbook state, draft workbook state, and runtime data.
- Require SG-0007 import audit events to be sanitized before any audit/import status is surfaced.
- Require SG-0007 to promote a validated candidate before SG-0013 reads `epp-full`.
- Do not expose absolute local paths to the original EPP source checkout in workspace metadata, document metadata, source popovers, or service responses.
- Do not treat canonical Markdown document-body mentions of historical source or worksheet names as SG-0013 blockers unless a later content-review slice says otherwise.
- Do not continue polishing HVA workbook UI before Appendix A is visible as a normal document.
- Do not make the tiny `epp-seed` fixture the user-facing EPP experience.
- Do not pre-render the full corpus as the normal browse path.
- Do not make React rebuild the full old Markdown, CFR, compliance, and artifact renderer from raw Markdown during SG-0013.
- Do not return only raw Markdown as the primary normal-reader payload.
- Do not build full inline editing, full HVA scoring, full artifact renderer parity, export, mobile layout, or approved write/apply flows in this slice.
- Do not let missing specialized artifact renderers block normal document browsing.
- Keep regulatory/static documents readable and searchable, but non-editable.
- Do not expose `workspaces/epp-full/source-files` as app content; it is development-only original source material.
- Do not expose original catalog source paths, browse targets, downloads, or attachment affordances from provenance-only source stubs.
- Do not expose development-only original source annotations as source details or extracted context.
- Do not tolerate dangling app-facing references to removed source annotations or removed raw source paths.
- Do not expose a generic `source_count`; use explicit provenance and retained-regulatory source counts.
- Do not assume SG-0007 reset review history, workbook progress, draft sidecars, or runtime state.
- Do not expose raw import diagnostics that contain development-only source paths, filenames, browse targets, or download targets.
- Do not expose SG-0007 staging import candidates through workspace discovery or document browsing.
- Retain and use `workspaces/epp-full/sources/regulatory` where it feeds CFR and Survey Guidance app views.

## Checklist

### 1. Service-Backed Reads

- [ ] Confirm `epp-full` can be discovered from the local service.
- [ ] Confirm the `epp-full` workspace has been refreshed by SG-0007 and `workspaces/epp-full/source-files` is physically absent.
- [ ] Confirm `workspaces/epp-full/project/catalog.json` is the normalized app-facing catalog and no raw upstream catalog copy with development-only source paths is retained.
- [ ] Confirm project metadata consumed by service responses does not expose development-only original office/catalog source paths.
- [ ] Confirm the SG-0007 post-import leak check passes before testing app/service browsing against `epp-full`.
- [ ] Confirm the SG-0007 post-cleanup reference-integrity check passes before testing app/service browsing against `epp-full`.
- [ ] Confirm workspace and source metadata service responses use explicit source count labels rather than generic `source_count`.
- [ ] Confirm workspace and source metadata service responses do not expose absolute local original-source checkout paths.
- [ ] Confirm SG-0007 refresh preserved `audit/ledger.jsonl`, existing workbook sidecars, draft workbook state, and runtime data.
- [ ] Confirm SG-0007 import audit events contain no raw source paths, development-only source filenames, browse targets, or download targets.
- [ ] Confirm SG-0007 staging import candidates are not returned by workspace discovery.
- [ ] Confirm service responses do not expose development-only original source annotations or `source_path` values.
- [ ] Add or adjust service response shape for workspace manifest reads.
- [ ] Add or adjust service response shape for document metadata reads.
- [ ] Add or adjust service response shape for document payload/source reads.
- [ ] Add a browser-ready navigation endpoint: `GET /api/workspaces/epp-full/navigation`.
- [ ] Add a document-read endpoint: `GET /api/workspaces/epp-full/documents/{doc_id}`.
- [ ] Document-read responses return browser-ready rendered compatibility output from current canonical source.
- [ ] Document-read responses include sanitized document metadata, stable anchor data, source/compliance orientation, and artifact placeholder/context data.
- [ ] Document-read responses may include source hash or canonical source identifiers for future review/edit workflows, but the normal reader does not depend on a raw-Markdown-only payload.
- [ ] Keep filesystem/project-data resolution in the local service; the React app owns presentation, filtering, and selected-document state.
- [ ] Ensure the app no longer depends on static seed imports for primary EPP browsing.
- [ ] Keep `epp-seed` available as a fixture, not the main EPP experience.
- [ ] If the service is unavailable, show a clear service-required state with retry; do not silently fall back to `epp-seed`.
- [ ] If `epp-full` is unavailable through the service, show a clear missing-workspace state rather than a fake working seed experience.
- [ ] Open directly into `epp-full` when it is available; do not land on a workspace picker, seed fixture, or neutral home screen.
- [ ] Default to a stable first document or configured default route without requiring last-opened document persistence.
- [ ] Preserve future hooks for Git history, audit ledger, proposals, search, and external workspace paths.

### 2. Navigation Model

- [ ] Build navigation from imported EPP project data, especially catalog metadata and `browser_nav_overrides.json`.
- [ ] Use `browser_nav_overrides.json` group, subgroup, and document ordering wherever available.
- [ ] For documents or fallback groups without explicit ordering, use stable deterministic ordering: subgroup label, then title, then document ID.
- [ ] Do not hard-code manual document ordering in React.
- [ ] Ensure every imported `epp-full` document is reachable somewhere in the app.
- [ ] Place imported documents that do not map cleanly to the old browser taxonomy into a quiet fallback group such as Other Imported Documents or Unmapped.
- [ ] Represent the Emergency Preparedness Program library layer.
- [ ] Represent the Survey Guidance library layer.
- [ ] Represent the Code of Federal Regulations library layer.
- [ ] Use one shared browser shell and library selector that changes the visible grouped navigation, rather than separate standalone nav shells for each layer.
- [ ] Preserve stable document IDs and deep-linkable document routes.
- [ ] Use a simple document-level URL shape based on workspace ID and document ID, such as `/workspaces/epp-full/documents/{doc_id}` or an equivalent hash route if simpler in Vite.
- [ ] Keep heading-level permalinks, saved user browsing history, and complex router state out of this slice.
- [ ] Show group counts.
- [ ] Support expand/collapse for groups and subgroups.
- [ ] On initial load, expand the active document's group.
- [ ] When opening Appendix A directly, expand Appendices.
- [ ] When switching libraries, expand the selected/default document's group.
- [ ] Let users manually expand/collapse groups during the session.
- [ ] Do not persist group expansion/collapse state across reloads in this slice.
- [ ] Route Appendix A through the Appendices group like any other appendix.

Required display groups:

- [ ] Governance and Planning.
- [ ] All-Hazards Response.
- [ ] Staffing and Operations.
- [ ] Communications.
- [ ] Evacuation.
- [ ] Hazard-Specific Procedures.
- [ ] Recovery.
- [ ] Resources and Attachments.
- [ ] Appendices.
- [ ] Survey Guidance.
- [ ] Code of Federal Regulations.

### 3. Browser Shell Layout

- [ ] Restore DOVAXIS brand in the top-left header.
- [ ] Restore program title: Emergency Preparedness Program.
- [ ] Restore top-right actions: Bookmarks, History, Settings.
- [ ] Keep Bookmarks, History, and Settings as visible shell affordances or quiet placeholders; defer persistence, history inspection, and configuration workflows.
- [ ] Keep Export or Download affordances placeholder-only if present; do not generate exports, print packets, PDFs, zip bundles, or current-document downloads in this slice.
- [ ] Build left nav rail with search, library selector, grouped nav, and counts.
- [ ] Build central document-first reader surface with paper-like spacing.
- [ ] Keep document metadata available through masthead controls or popovers, not a dominant right pane.
- [ ] Remove or collapse the current right inspector as a primary layout element for this slice.
- [ ] Keep HVA, History, Audit, Assistant, and Edit as small reader/header affordances or placeholders rather than a competing third column.
- [ ] Keep source/compliance metadata lightweight: title, document ID, content type/library, source/status when available, and quiet source/compliance controls or placeholders.
- [ ] Do not show development-only original `source-files` entries as source attachments, downloads, or app documents.
- [ ] If source metadata references original catalog sources, show only non-browseable provenance labels/status, not original file paths or open/download controls.
- [ ] Keep retained regulatory source context available where it supports viewed CFR and Survey Guidance documents.
- [ ] Defer full compliance graph traversal, backlinks, related-document ranking, and rich CFR/E-tag relationship UI.
- [ ] Keep assistant/editing affordances ready to overlay the reader later.
- [ ] Keep Markdown editing affordances placeholder-only; do not enable edit mode, draft autosave, formatting controls, or draft review in this slice.
- [ ] Treat desktop layout as the only required viewport.

### 4. Reader And Live Compatibility Path

- [ ] Render the selected document from current canonical source at app view time.
- [ ] Generate browser-ready compatibility output in the local service document-read path.
- [ ] React consumes the service-rendered compatibility output for normal browsing.
- [ ] React owns shell layout, navigation state, selected-document state, filters, masthead controls, and placeholder affordances.
- [ ] Do not reimplement the full old Markdown/CFR/compliance/artifact renderer in React for this slice.
- [ ] Render documents as readable HTML rather than raw Markdown for normal browsing.
- [ ] Preserve old-browser reader typography and paragraph rhythm enough for SG-0013 smoke.
- [ ] Extract/display document title from source metadata or H1.
- [ ] Keep heading IDs stable enough for deep links.
- [ ] Render headings, paragraphs, lists, tables, and code blocks well enough to read policy, Appendix A, Survey Guidance, and CFR samples.
- [ ] Strip or soften internal working sections when needed so the reader does not expose planning scaffolding as normal document text.
- [ ] Highlight placeholder tokens such as `{{facility_name}}`.
- [ ] Preserve or gracefully placeholder artifact blocks that are not yet fully implemented, including enough source-aware context to keep the document useful.
- [ ] Keep CFR/regulatory pages readable in the appropriate library layer.
- [ ] Defer polished Markdown parity, inline CFR citation linking, full eCFR indentation, compliance popovers, specialized artifact panels, and editing-aware section wrappers.
- [ ] Do not introduce raw Markdown editing in the normal reader UI.

### 5. Appendix A And Workbook Affordance

- [ ] Appendix A appears under Appendices in the left nav.
- [ ] Appendix A opens as a normal document route.
- [ ] Appendix A displays enough wrapper/source context to orient the user.
- [ ] Appendix A exposes an attached HVA workbook entry point in the place the real workbook will live.
- [ ] HVA workbook entry point is placeholder-only; do not require scoring, sidecar state writes, hazard filters, print/export output, or Appendix J linkage in this slice.
- [ ] Leaving Appendix A for another document preserves browser orientation.

### 6. Search And Navigation Behavior

- [ ] Search input filters or locates manual documents from left-nav metadata such as title, group, library, and known document ID.
- [ ] Group counts show total documents when no search query is active.
- [ ] When search is active, counts show filtered counts or x-of-y context so documents do not appear to have vanished.
- [ ] Clearing search restores normal counts and unfiltered group visibility.
- [ ] Full-content search across document bodies is deferred to a later slice.
- [ ] Library switching keeps the user oriented.
- [ ] When switching libraries, keep the current document selected only if it belongs to the target layer.
- [ ] If the current document is outside the target layer, select that layer's configured/default first document.
- [ ] Do not preserve separate last-selected document state per library layer in this slice.
- [ ] Empty/loading/error states are quiet and useful.
- [ ] Current document selection is obvious in the nav.
- [ ] Back/forward or deep-link behavior does not break normal document browsing.
- [ ] Opening a document URL directly selects the matching document when the service is available.

### 7. Validation

- [ ] Run `python3 ${CODEX_HOME:-$HOME/.codex}/skills/senku-prep/scripts/brain.py validate`.
- [ ] Smoke `/api/workspaces` against `epp-full`.
- [ ] Smoke `/api/workspaces/epp-full` and `/api/workspaces/epp-full/navigation`.
- [ ] Smoke `/api/workspaces/epp-full/documents/{doc_id}` against at least one policy, Appendix A, one Survey Guidance page, and one CFR page.
- [ ] Confirm document-read smoke responses contain rendered compatibility output rather than raw Markdown only.
- [ ] Confirm document-read smoke responses include stable anchors and enough metadata for source/compliance orientation and artifact placeholders.
- [ ] Confirm the browser-shell work starts from an `epp-full` refresh that did not reset audit ledger, workbook state, draft workbook state, or runtime data.
- [ ] Confirm the browser-shell work starts from an `epp-full` refresh whose audit import event is sanitized.
- [ ] Confirm the browser-shell work starts from the promoted live `epp-full` workspace, not an import staging candidate.
- [ ] Verify service-unavailable behavior shows a clear service-required state and retry path.
- [ ] Run `npm run build`.
- [ ] Run a repeatable desktop browser smoke or screenshot check that proves the full EPP nav appears.
- [ ] Open the Appendix A document URL directly.
- [ ] Expand Appendices and open Appendix A.
- [ ] Verify Appendix A shows an HVA workbook entry point without requiring workbook interaction.
- [ ] Switch to Survey Guidance and CFR and open one document from each library layer.
- [ ] Switch to another policy/procedure and confirm orientation is preserved.
- [ ] Run `git diff --check`.

## Definition Of Done

`SG-0013` is done when the app opens into the old DOVAXIS/EPP document-first layout, reads `epp-full` through the service, exposes full grouped navigation with library layers, keeps every imported document reachable somewhere in the app, opens Appendix A as a normal document, keeps artifact-heavy documents browseable even when renderer-specific parity is deferred, and shows the HVA workbook affordance without requiring workbook-polish work to judge the browser shell.

## Follow-On Work

- `SG-0014`: deeper Markdown viewer, artifact compatibility, inline editing, and proposal-review parity.
- `SG-0006`: active EPP artifact inventory and runtime renderer coverage.
- `SG-0004`: local agent/chat proposal and review workflow.
- `SG-0005`: inline manual editing and draft review.
