# Senku Archivist Discovery Packet

## Working Model

Archivist is a local-first document workbench. It should become a true Vite-based browser app backed by a local service, while preserving the useful safety and review ideas from the original EPP manual browser.

The Emergency Prep Project manual is the first serious workspace because it is complex and immediately useful. It should prove the app, support coworker local copies, and help speed recommended edit/review workflows. It should not become the only content model Archivist can understand.

## Source Evidence

- Original repo: `~/Dovaxis - DevOps/Emergency Prep Project`
- Current generated browser: `_reviews/epp-manual-browser/index.html`
- Current static generator: `_framework/scripts/prepare_manual_browser.py`
- Current local bridge: `_framework/scripts/run_manual_agent_bridge.py`
- Current service/runtime pattern: `_reviews/epp-manual-browser/agent-runtime/`
- Current content roots: `_content/` and `_project/`

## Assumptions

- The app remains local-first for now.
- Vite is the preferred frontend foundation so Dovaxis developers can mirror useful pieces later.
- EPP content should be packaged or imported as a workspace, not used as the permanent app folder structure.
- Human-reviewed recommendations, placeholder completion, and eventual export are core future workflows.
- Markdown bundles remain the canonical v1 document source, with approved changes writing back through review gates.
- The latest approved version of a document is the normal reading surface.
- Historical changes are a first-class product capability, not just a developer escape hatch.
- Long-term file history should use a hybrid model: real Git for durable document snapshots/diffs, plus an Archivist audit ledger for policy-workflow context.
- V1 should use a small bundled EPP seed workspace for development and demos, while preserving a manifest shape that can later open a full external EPP workspace.
- V1 is desktop-only local software; mobile layout is out of scope.
- The port target includes the old EPP Markdown/browser functionality and local chat/manual-agent workflow, not only the initial Vite scaffold.
- The EPP proving workspace should include the full EPP corpus, not just a few seed documents.
- Workbooks should be a first-class artifact family. Appendix A / HVA is the first workbook implementation, not a one-off exception.

## Top Risks

1. HVA workbook depth: full hazard scoring workflow next versus a smaller review-evidence workflow expansion first.
2. Renderer strategy: compatibility renderer first versus direct React rebuild.
3. Agent/chat contract: provider-neutral local interface versus direct port of the old LM Studio bridge.
4. Migration scope: imported source/project data should not drag the generated static browser into the new app as architecture.
5. Coworker handoff: local copies need to be usable without requiring the original process repo.
6. Export posture: exported manuals must reflect the latest approved document set while retaining traceability to historical change records.

## Resolved Questions

Q-0001: Should v1 treat Markdown bundles as canonical source files that approved changes write back to, or should Archivist maintain its own workspace state and export Markdown later?

Answer: keep Markdown bundles as canonical for v1, but require proposal/review gates before automated writes.

Q-0002: Should the long-term document history be backed by actual Git commits, an Archivist-owned append-only change ledger, or both?

Answer: use real Git for durable file history and diffs, plus an Archivist audit ledger that links proposals, approvals, model/user rationale, exports, and review events to commit hashes.

Q-0003: Should v1 package EPP as a bundled seed workspace inside this repo, or should Archivist open an external EPP workspace path from the original process repo?

Answer: start with a small bundled seed workspace for development and demos, while designing the workspace manifest so a full external EPP workspace can be opened later.

Q-0005: Should we pursue old-browser feature parity first, or rebuild only the parts that feel product-ready?

Answer: target full behavior parity as the acceptance contract, but implement it as staged React/service slices. Do not copy the generated HTML as the new app.

Q-0012: Should the EPP workspace stay as a small seed subset, or should the full EPP content corpus live in this repo?

Answer: import the full EPP content corpus into this repo as a standalone workspace while keeping the seed workspace available for fast scaffold testing.

Q-0011: Should Appendix A be treated as a normal Markdown appendix with an embedded HVA widget, or as a first-class HVA workbook/tool surface attached to the Appendix A document record?

Answer: make Appendix A the first implementation of a first-class workbook artifact family.

Q-0013: Should approved workbook state be stored in structured sidecar JSON files linked to the parent document, or embedded back into the parent Markdown document?

Answer: store workbook state in structured sidecar JSON files linked to the parent document and workbook ID. Keep Markdown for explanatory text and workbook definitions.

Q-0014: Should the HVA prototype start with a service-backed sidecar state skeleton, or with a front-end-only mock state?

Answer: start with a service-backed sidecar state skeleton.

Q-0015: Should the first HVA UI prototype edit draft sidecar state directly, or remain read-only against approved sidecar state until review flow exists?

Answer: edit draft sidecar state directly, with a clear draft badge and no approved write path until review/apply exists.

## Parked Future Question

Q-0016: Should the next HVA UI slice build the full hazard scoring workflow, or expand the review-evidence workflow first?

Parked recommendation: expand the review-evidence workflow first, then add hazard scoring. Review evidence is smaller, proves draft persistence and export linkage, and reduces UI risk before the scoring matrix. This is parked until HVA UI work resumes; SG-0013 browser-shell work is the active next build slice.

See `docs/discovery/epp-port-inventory.md` for the current port inventory and historical question record.
