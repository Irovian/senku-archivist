# EPP Archivist Port Inventory

## Port Target

Archivist should port the old EPP manual-browser functionality into the standalone desktop-local app. The old implementation should be treated as behavior evidence and a source library, not as the target architecture.

The new app is desktop-only. Mobile layout and mobile smoke checks are not part of the product target.

The EPP workspace target is the full corpus, not a representative seed. The seed workspace can remain for fast scaffold testing, but parity and edge-case work should use `workspaces/epp-full`.

The current React app does not yet satisfy browser parity: it still uses `epp-seed` for its document list, so Appendix A is not visible as a normal document. Restoring the full EPP browser shell and navigation is now the next UX priority before deeper workbook polish.

## Existing EPP Capabilities To Preserve

### Document Browser

- 222 represented documents in the generated browser.
- Left navigation with search, grouped navigation, browser nav overrides, and document count metadata.
- Library selector for Emergency Preparedness Program, Survey Guidance, and Code of Federal Regulations.
- Default document routing and stable document IDs.
- Document masthead controls for source details, compliance details, and local build details.
- Related documents, backlinks, mentioned documents, and appendix utility links.
- DOVAXIS global header, Emergency Preparedness Program label, and top-right Bookmarks, History, and Settings actions.
- Appendix A must appear under the Appendices group and route as a normal document before the attached HVA workbook UI is considered complete.

### Markdown Rendering

- Strip internal working sections from reader output while preserving canonical Markdown source.
- Preserve H1 extraction, heading anchors, duplicate heading disambiguation, lists, paragraphs, code blocks, tables, and Markdown table safety.
- Render assembly/customizable sections as facility-specific content.
- Render regulatory segments with stable anchors.
- Link inline CFR citations to matching CFR documents/subsections when crosswalk matches exist.
- Render customization tokens/placeholders distinctly.
- Keep regulatory/static documents viewable but non-editable.

### Compliance And Regulatory Navigation

- Read `_project/compliance_relationship_graph.json`.
- Traverse policies, requirements, CFR anchors, Appendix Z E-tags/segments, sources, and curated policy relationships.
- Render compact bottom-of-document compliance links and expandable overflow popovers.
- Keep source details in masthead controls rather than bottom compliance links.
- Render Appendix Z provenance and provider-branch collapsing.
- Render CFR pages in an eCFR-style indented paragraph view.

### Artifact And Tool Rendering

- Support artifact payloads and summaries.
- Existing renderer types include job action sheets, org charts, workflow algorithms, fixed page forms, table tools, directories, profiles, assessment workbooks, calculators, training quizzes, legal templates, quick references, reference guides, map attachments, and tool indexes.
- HVA workbook uses an interactive `hva-workbook-v1` renderer with local state, scoring, mitigation actions, action drafts, filters, modals, and print behavior.

### Full EPP Import

- The EPP catalog contains 261 documents and 63 source records.
- Imported document types include topic documents, regulatory E-tags, CFR pages, support artifacts, appendices, and regulatory support documents.
- Imported content groups include regulatory, hazard-specific procedures, evacuation, all-hazards response, incident command, governance and planning, appendices, resources and lists, and recovery.
- The standalone workspace should preserve `_content`, `_project`, extracted source context, regulatory sources, and original catalog source files when available.
- The generated `_reviews/epp-manual-browser` output remains behavior evidence, not copied app architecture.

### Appendix A / HVA Edge Case

- Appendix A is `DOC-APPENDICES-APPENDIX_A`, content type `appendix`, lifecycle status `drafting`.
- It contains an `epp-artifact/v1` block with `artifact_type: assessment_workbook` and `renderer_template: hva-workbook-v1`.
- Its digital intent is guided hazard selection, scoring, prioritization, mitigation planning, review evidence, local autosave, and JSON import/export.
- Its print intent is a survey-ready HVA summary with methodology, included hazards, ranked priorities, mitigation actions, and annual review evidence.
- Its current checkpoint questions are scoring formula, default hazard catalog, and Appendix J linkage.
- Its content explicitly preserves a copyright guardrail against copying proprietary HVA worksheet language, examples, row order, visual layout, or comments.

### Workbook Artifact Family

- Workbooks are a first-class artifact family, not an Appendix A-only exception.
- HVA is the first workbook implementation.
- A workbook should distinguish document text, workbook definition, workbook state, derived outputs, and print/export views.
- Workbook state should be structured and auditable so future workbooks can support validation, diffs, import/export, and approved-history review.
- Approved workbook state should live in structured sidecar JSON files linked to the parent document and workbook ID.
- Calculators, directories, logs, forms, charts, inventories, quizzes, and quick references should remain separate artifact families unless they need workbook-level multi-step state and export behavior.

### Agent And Chat

- Floating manual-agent affordance with draggable panel.
- Local-only LM Studio/OpenAI-compatible provider by default.
- Provider status, model selection, bridge URL, and developer/debug panel.
- Selection-aware instruction box.
- Model-created proposals using line patch and targeted operation schemas.
- Direct operation proposals for Codex/MCP-authored exact edits.
- Pending review polling and long-poll event sync.
- Current-view sync from browser to local service.
- Apply/reject proposal workflow.
- Demo mode by default; live apply only by explicit mode.
- Hash-checked apply to prevent stale writes.
- Static regulatory write rejection.

### Inline Manual Editing

- Low-ceremony inline editing for narrow block types.
- Editable blocks include `p`, `li`, `h2`, `h3`, and `h4`.
- Basic formatting controls: undo, bold, italic, paragraph, H2/H3/H4, bullets, numbered lists.
- Insert section affordance.
- Autosave draft capture on edit exit/section change/Escape.
- Draft review surface reuses the proposal-review lens shape.
- Pending draft badge/dock and old/new/suggested compare controls.

### Review And Visual Diff

- Proposal preview applies to the page before approval.
- AR-style reader/editor overlay frames changed text.
- Pretext-backed lens visual magnifies real page text.
- Meaningful changed tokens get insert/delete/replace/rewrite styling.
- Suggested, before, and both compare modes.
- Stale queued proposal handling preserves the approved preview while clearing bad pending state.

### Local Service, MCP, And Desktop Launch

- Loopback bridge endpoints: status, document, patches, pending reviews, current view, events, export snapshot, search, propose, direct propose, apply, reject.
- SQLite-backed runtime store for workspaces, documents, view state, proposals, proposal events, model calls, and audit events.
- MCP server tools for current view, document read/search, proposal queueing, pending reviews, review events, guarded apply, and export snapshot.
- One-click desktop launcher starts the bridge, opens Chrome/Chromium, and writes runtime logs.
- Eval harness measures prompt, validation, anchoring, preview metadata, and Markdown preservation.

## Port Questions

### Q-0004: Service Boundary First

Should the next slice connect the Vite app to the local service for workspace/document reads, or keep static imports briefly while building the Git history inspector?

Answer: fold service-backed workspace and document reads into SG-0013. The old chat, external workspaces, Git history, approved writes, export, and full EPP browser shell all need the same trusted filesystem boundary.

### Q-0005: Parity Strategy

Should we pursue old-browser feature parity first, or rebuild only the parts that feel product-ready?

Answer: target full behavior parity as the acceptance contract, but implement it as staged React/service slices. Do not copy the generated HTML as the new app.

### Q-0006: Markdown Renderer Strategy

Should the Markdown/rendering pipeline be ported as a backend-generated HTML compatibility layer first, or rebuilt directly as React components?

Answer: use a live compatibility renderer first for Markdown, CFR, compliance, and artifacts, then promote high-value surfaces into React components. Compatibility means preserving old browser behavior while rendering from canonical source at view time, not pre-rendering the full corpus as a static browse path.

### Q-0007: Agent Provider Shape

Should the old LM Studio bridge remain the agent/chat contract, or should Archivist define a provider-neutral local agent interface with LM Studio as the first adapter?

Answer: define a provider-neutral local agent interface, with an LM Studio/OpenAI-compatible local endpoint as the default adapter. The old bridge remains source evidence, but the product contract should be local agent capabilities, provider status, proposals, review queueing, and diagnostics rather than one provider implementation.

### Q-0008: Manual Edits Versus Agent Proposals

Should inline manual edits and model proposals stay as separate workflows, or collapse into one proposal system?

Answer: keep them separate at input time, but unify their review/audit output. Manual edits should remain low-ceremony drafts; model edits should remain explicit proposals. Once accepted, both should move through the same approval, Git history, and Archivist audit ledger path.

### Q-0009: History Granularity

Should each accepted proposal create its own Git commit, or should Archivist batch accepted proposals into review-session commits?

Answer: one accepted model proposal or approved manual-draft batch should create one Git commit by default. Add review-session batching later only if granular commits become too noisy.

### Q-0010: Artifact Renderers

Should artifact support mean pre-rendering every old artifact output, or live-rendering source documents with runtime renderer support for the active artifact families present in the imported EPP corpus?

Answer: live-render from source, with runtime renderer support for active EPP artifact families. Pre-render only for export, print, review snapshots, or disposable caches. Unknown or rare artifact blocks should degrade into source-aware placeholders until a renderer exists.

### Q-0011: Appendix A Shape

Should Appendix A be treated as a normal Markdown appendix with an embedded HVA widget, or as a first-class HVA workbook/tool surface attached to the Appendix A document record?

Answer: make Appendix A the first implementation of a first-class workbook artifact family. Keep the Markdown wrapper and source/compliance metadata visible, but let the HVA itself behave like a structured local tool with state, import/export, print, review evidence, and Appendix J linkage.

### Q-0013: Workbook State Storage

Should approved workbook state be stored in structured sidecar JSON files linked to the parent document, or embedded back into the parent Markdown document?

Answer: store workbook state in structured sidecar JSON files linked to the parent document and workbook ID. Keep Markdown for explanatory text and workbook definitions. This preserves validation, diffs, auditability, JSON import/export, and future workbook reuse.

### Q-0014: HVA Prototype State Path

Should the HVA prototype start with a service-backed sidecar state skeleton, or with a front-end-only mock state?

Answer: start with a service-backed sidecar state skeleton. This makes the prototype prove the durable workbook boundary while still allowing the initial UI to stay intentionally narrow.

### Q-0015: HVA UI Draft Writes

Should the first HVA UI prototype edit draft sidecar state directly, or remain read-only against approved sidecar state until review flow exists?

Answer: edit draft sidecar state directly, with a clear draft badge and no approved write path until review/apply exists. This lets the workbook feel alive without violating approved-history guardrails.

### Q-0016: HVA UI Depth

Should the next HVA UI slice build the full hazard scoring workflow, or expand the review-evidence workflow first?

Parked recommendation: expand the review-evidence workflow first, then add hazard scoring. Review evidence is smaller, proves draft persistence and export linkage, and reduces UI risk before the scoring matrix. This does not block the current SG-0013 browser-shell slice.

### Q-0017: Browser Shell Before Workbook Polish

Should the next build slice restore the full EPP browser shell/navigation first, or continue polishing HVA workbook UI before Appendix A is visible as a normal document?

Answer: restore the full EPP browser shell/navigation first. The user needs to browse Appendix A, appendices, policies, Survey Guidance, and CFR through the familiar old layout before workbook-specific UI can be judged in context.

### Q-0018: Renderer Port Strategy

Should Markdown and artifacts be ported through a compatibility renderer first, or rebuilt directly as final React components?

Answer: use a live compatibility renderer first for Markdown, CFR, compliance, and artifact output, then convert high-value artifact families into React components once the browsing shell is stable.

### Q-0012: Full Content Import

Should the EPP workspace stay as a small seed subset, or should the full EPP content corpus live in this repo?

Answer: import the full EPP content corpus into this repo as a standalone workspace. Keep the seed workspace only as a fast scaffold fixture.
