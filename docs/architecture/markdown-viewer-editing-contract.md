# Markdown Viewer And Editing Contract

## Purpose

Archivist's document reader should preserve the old EPP manual-browser Markdown behavior and low-ceremony editing model. The new app should not turn into a generic Markdown editor or a card-heavy dashboard.

## Canonical Source

Markdown bundles remain canonical for v1 document text. Approved document edits write back through explicit review gates and must participate in Git plus Archivist audit history.

Runtime drafts, autosaves, model proposals, and workbook draft state stay outside committed approved history until review/apply promotes them.

## Viewer Responsibilities

The first implementation pass should use live compatibility rendering for Markdown, CFR, compliance, and artifact output. Source Markdown, catalog data, crosswalks, eCFR XML, artifact definitions, and workbook sidecars remain canonical. The local service document-read path should return browser-ready rendered compatibility output from current source at view time, not a raw-Markdown-only payload for the normal reader. Pre-rendered output is acceptable for export, print, review snapshots, or disposable caches, but the normal reader should render from current source at view time. Native React components should be promoted later for high-value surfaces once the full browser shell is stable.

The viewer must preserve these old-browser behaviors:

- Strip internal working sections from reader output while preserving source Markdown.
- Strip browser-only regulatory scaffolding from regulatory pages when appropriate.
- Render H2-H6 headings with stable anchors.
- Preserve duplicate heading disambiguation.
- Render paragraphs, lists, code blocks, fenced blocks, and tables.
- Render facility-specific/customizable sections as special callouts.
- Render regulatory segments with stable anchors and collapse metadata.
- Highlight placeholders/customization tokens distinctly.
- Link inline CFR citations to matching CFR pages and subsection anchors when crosswalk data supports it.
- Render CFR sections in an eCFR-style indented view.
- Render artifact blocks through artifact-family renderers.

## Artifact Renderer Families

The old EPP corpus includes these active artifact families:

- Assessment workbook.
- Calculator.
- Communications guide.
- Compliance calendar.
- Contact directory.
- Facility profile.
- Fixed page form.
- Generator profile.
- Inventory checklist.
- Job action sheet.
- Key control table.
- Legal template.
- Map attachment.
- Org chart.
- Planning log.
- Quick reference.
- Receiving facility directory.
- Reference guide.
- Resource inventory.
- Review log.
- Route matrix.
- Site access record.
- Training quiz.
- Utility matrix.
- Vehicle roster.
- Vendor directory.
- Workflow algorithm.

Not every artifact is a workbook. Workbooks are the stateful, multi-step, review/export-oriented family. HVA is the first workbook.

## Inline Manual Editing

The accepted editing model is low ceremony:

- Inline editing is scoped to document sections and narrow block types.
- Editable block types include `p`, `li`, `h2`, `h3`, and `h4`.
- Editing uses `contenteditable` on the active section, with protections so selection stays in editable content.
- The floating toolbar uses familiar controls: undo, bold, italic, paragraph, H2, H3, H4, bullets, numbered lists, and insert section.
- There are no per-section save/cancel confirmation buttons in the default flow.
- Moving away, changing section, or pressing Escape captures an autosaved draft when content changed.
- One live undo is available while editing.
- Drafts remain pending until reviewed.

## Draft Review

Manual draft review should reuse the proposal-review visual language:

- Pending draft count is visible from the dock.
- Draft review opens an old/new lens on the real reader page.
- Reviewer can step through multiple draft changes.
- Reviewer can toggle old versus new.
- Draft review should feel like the accepted proposal lens, not a separate spreadsheet-like change list.

## Model Proposal Review

Model recommendations should preserve the old local-agent contract:

- Provider-neutral local agent interface by default.
- LM Studio/OpenAI-compatible local endpoint as the first adapter.
- Selection-aware instructions.
- Proposal generated as a reviewable patch, not an automatic write.
- Hash-checked apply path to avoid stale writes.
- Demo mode by default.
- Live apply only when explicitly enabled.
- Regulatory/static documents reject writes.
- Stale queued proposals clear safely without losing the last approved preview.

## Visual Diff And Lens

The old visual review behavior is part of the product experience:

- Proposal preview changes the page in place before approval.
- Lens frames the affected text on the page.
- Meaningful inserted/replaced/deleted tokens are highlighted.
- Suggested, before, and both compare modes are available.
- Pretext-backed lens/motion behavior can be ported after the static compatibility pass, but the review shape should be preserved.

## Service Boundary

The React app should not write Markdown directly. Viewer and editor work should move through the local service:

- Read workspace/document metadata.
- Read Markdown document source.
- Read rendered compatibility output as the normal browser payload.
- Queue manual drafts.
- Queue model proposals.
- Read pending reviews.
- Apply approved writes later.
- Link approved writes to Git commits and Archivist audit events.

## Prep Recommendation

Before expanding workbook UI, implement the full EPP document browser shell and compatibility reader path. This makes Appendix A visible as a document and gives inline editing/proposal review a real page to attach to.
