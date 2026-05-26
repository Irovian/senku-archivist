# EPP Browser UI Parity Contract

## Why This Exists

The current Archivist scaffold does not yet show Appendix A as a normal document because the React reader still uses the tiny `epp-seed` fixture. The full EPP workspace is imported and service-visible, but the app shell has not yet been wired to the full document navigation and reader contract.

That is the wrong long-term shape. Appendix A must be reachable from the normal EPP document browser before workbook-specific UI is considered successful.

## Source Baseline

Primary behavior evidence:

- Original generated browser: `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/index.html`
- Browser generator: `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_framework/scripts/prepare_manual_browser.py`
- Browser README: `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/README.md`
- Navigation audit: `/home/irovian/Dovaxis - DevOps/Emergency Prep Project/_reviews/epp-manual-browser/nav-audit.md`
- Full imported workspace: `workspaces/epp-full`

The old UI is the visual and interaction baseline. React should replace the generated-page architecture, not discard the browser experience.

## Current Gap

The app currently has:

- A Vite scaffold shell.
- A seed document reader with three EPP documents.
- A workbook inspector that can read/write HVA draft sidecar state.
- No full EPP document nav in the app.
- No normal route to Appendix A in the reader.

This means the HVA workbook plumbing exists before the user can browse Appendix A as an appendix. That sequencing is useful as a storage proof, but it should not continue into the next user-facing slice.

## Required Top-Level Layout

The target desktop layout should preserve the old browser's shape:

- DOVAXIS brand at top left.
- Program title in the global header: Emergency Preparedness Program.
- Global actions at top right: Bookmarks, History, Settings.
- Left navigation rail with manual search, library selector, grouped nav, and counts.
- Central reader surface with a clean document sheet and enough whitespace around policy text.
- Document metadata available from masthead controls or popovers, not as a permanently dominant right pane.
- Local assistant/editing affordances overlaid on the reader, not replacing the reader.

The current three-pane scaffold can be useful for internal experiments, but the EPP browser parity target is the old document-first layout.

## Navigation Contract

The full EPP browser nav must be driven from imported EPP project data, especially `browser_nav_overrides.json` and the catalog.

Required display groups:

- Governance and Planning.
- All-Hazards Response.
- Staffing and Operations.
- Communications.
- Evacuation.
- Hazard-Specific Procedures.
- Recovery.
- Resources and Attachments.
- Appendices.
- Survey Guidance.
- Code of Federal Regulations.

Required behavior:

- Search the manual from the left nav.
- Switch library layers between Emergency Preparedness Program, Survey Guidance, and CFR.
- Show group counts.
- Expand/collapse groups and subgroups.
- Preserve stable document IDs and deep-linkable routes.
- Route Appendix A through the Appendices group like any other appendix.
- Keep regulatory documents searchable/readable but non-editable.

## Reader Contract

The reader must preserve:

- H1 title extraction and stable heading anchors.
- Reader sheet styling, typography, and paragraph rhythm from the old browser.
- Placeholder token highlighting, such as `{{facility_name}}`.
- Customizable/facility-specific sections.
- Artifact panels and specialized artifact renderers.
- Inline CFR citation links when crosswalk targets exist.
- Bottom-of-document compliance links and popovers.
- Related documents, backlinks, mentioned documents, and source/build details.
- eCFR-style rendering for CFR pages.

The app should use a live compatibility renderer first. The app should render from current canonical source at view time instead of pre-rendering the full corpus as a static browse path. Direct React components can replace high-value surfaces later after the browser shell is stable and usage proves which surfaces deserve native component polish.

## Utility Surfaces

Bookmarks, History, and Settings should return as real UI entry points even if they start as thin surfaces:

- Bookmarks: saved document/heading references.
- History: document/workbook change history, not browser history only.
- Settings: local service URL, provider status, display preferences, and local-only guardrails.

## Acceptance Gate

Before deeper HVA workbook polish, the app should pass this simple user-facing gate:

- User can open the app.
- User can see the full EPP nav.
- User can expand Appendices.
- User can open Appendix A as a normal document.
- User can see that Appendix A has an attached HVA workbook affordance.
- User can return to another policy/procedure without losing orientation.
