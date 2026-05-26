# SG-0013 Build Checklist: Full EPP Browser Shell And Navigation

## Artifact Role

This is the implementation checklist for `SG-0013`. It is not a separate Senku canonical artifact type; the canonical state remains the backlog item, decision records, requirements, questions, and session record under `.project-brain/`.

Use this checklist as the build-prep handoff for restoring the full EPP browser shell, service-backed reads, full navigation, and Appendix A visibility.

## Source Inputs

- `.project-brain/backlog/items/SG-0013.json`
- `.project-brain/decisions/DEC-SG-0011.json`
- `.project-brain/decisions/DEC-SG-0012.json`
- `.project-brain/decisions/DEC-SG-0014.json`
- `.project-brain/decisions/DEC-SG-0015.json`
- `docs/architecture/epp-browser-ui-parity-contract.md`
- `docs/architecture/markdown-viewer-editing-contract.md`
- `workspaces/epp-full/workspace.json`
- `workspaces/epp-full/project/`

Old-browser source evidence:

- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/index.html`
- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_framework/scripts/prepare_manual_browser.py`
- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/nav-audit.md`

## Guardrails

- Do not continue polishing HVA workbook UI before Appendix A is visible as a normal document.
- Do not make the tiny `epp-seed` fixture the user-facing EPP experience.
- Do not pre-render the full corpus as the normal browse path.
- Do not build full inline editing, full HVA scoring, full artifact renderer parity, export, mobile layout, or approved write/apply flows in this slice.
- Keep regulatory/static documents readable and searchable, but non-editable.

## Checklist

### 1. Service-Backed Reads

- [ ] Confirm `epp-full` can be discovered from the local service.
- [ ] Add or adjust service response shape for workspace manifest reads.
- [ ] Add or adjust service response shape for document metadata reads.
- [ ] Add or adjust service response shape for document payload/source reads.
- [ ] Ensure the app no longer depends on static seed imports for primary EPP browsing.
- [ ] Keep `epp-seed` available as a fixture, not the main EPP experience.
- [ ] Preserve future hooks for Git history, audit ledger, proposals, search, and external workspace paths.

### 2. Navigation Model

- [ ] Build navigation from imported EPP project data, especially catalog metadata and `browser_nav_overrides.json`.
- [ ] Represent the Emergency Preparedness Program library layer.
- [ ] Represent the Survey Guidance library layer.
- [ ] Represent the Code of Federal Regulations library layer.
- [ ] Preserve stable document IDs and deep-linkable document routes.
- [ ] Show group counts.
- [ ] Support expand/collapse for groups and subgroups.
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
- [ ] Build left nav rail with search, library selector, grouped nav, and counts.
- [ ] Build central document-first reader surface with paper-like spacing.
- [ ] Keep document metadata available through masthead controls or popovers, not a dominant right pane.
- [ ] Keep assistant/editing affordances ready to overlay the reader later.
- [ ] Treat desktop layout as the only required viewport.

### 4. Reader And Live Compatibility Path

- [ ] Render the selected document from current canonical source at app view time.
- [ ] Preserve old-browser reader typography and paragraph rhythm enough for SG-0013 smoke.
- [ ] Extract/display document title from source metadata or H1.
- [ ] Keep heading IDs stable enough for deep links.
- [ ] Highlight placeholder tokens such as `{{facility_name}}`.
- [ ] Preserve or gracefully placeholder artifact blocks that are not yet fully implemented.
- [ ] Keep CFR/regulatory pages readable in the appropriate library layer.
- [ ] Do not introduce raw Markdown editing in the normal reader UI.

### 5. Appendix A And Workbook Affordance

- [ ] Appendix A appears under Appendices in the left nav.
- [ ] Appendix A opens as a normal document route.
- [ ] Appendix A displays enough wrapper/source context to orient the user.
- [ ] Appendix A exposes an attached HVA workbook affordance.
- [ ] HVA affordance can point to existing workbook state plumbing without implementing full scoring.
- [ ] Leaving Appendix A for another document preserves browser orientation.

### 6. Search And Navigation Behavior

- [ ] Search input filters or locates manual documents from the left nav.
- [ ] Library switching keeps the user oriented.
- [ ] Empty/loading/error states are quiet and useful.
- [ ] Current document selection is obvious in the nav.
- [ ] Back/forward or deep-link behavior does not break normal document browsing.

### 7. Validation

- [ ] Run `python3 ${CODEX_HOME:-$HOME/.codex}/skills/senku-prep/scripts/brain.py validate`.
- [ ] Smoke `/api/workspaces` against `epp-full`.
- [ ] Smoke document-read endpoints against at least one policy, Appendix A, one Survey Guidance page, and one CFR page.
- [ ] Run `npm run build`.
- [ ] Open the app and verify the full EPP nav appears.
- [ ] Expand Appendices and open Appendix A.
- [ ] Verify Appendix A shows an HVA workbook affordance.
- [ ] Switch to another policy/procedure and confirm orientation is preserved.
- [ ] Run a desktop-only browser smoke or screenshot check.
- [ ] Run `git diff --check`.

## Definition Of Done

`SG-0013` is done when the app opens into the old DOVAXIS/EPP document-first layout, reads `epp-full` through the service, exposes full grouped navigation with library layers, opens Appendix A as a normal document, and shows the HVA workbook affordance without requiring workbook-polish work to judge the browser shell.

## Follow-On Work

- `SG-0014`: deeper Markdown viewer, artifact compatibility, inline editing, and proposal-review parity.
- `SG-0006`: active EPP artifact inventory and runtime renderer coverage.
- `SG-0004`: local agent/chat proposal and review workflow.
- `SG-0005`: inline manual editing and draft review.
