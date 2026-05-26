# Workbook Artifact Contract

## Working Decision

Archivist treats workbooks as a first-class artifact family. HVA is the first workbook implementation, but the workbook model should also support future guided assessments, planning workbooks, review packets, scoring tools, and evidence workbooks.

## Workbook Definition

A workbook definition describes the tool itself. It can live in a document-bound artifact block or project artifact index and should include:

- Stable workbook ID and parent document ID.
- Artifact type, schema version, and renderer template.
- Workflow steps or tabs.
- Field definitions, scoring dimensions, validations, and derived outputs.
- Print/export rules.
- Review questions and human-checkpoint prompts.
- Source, requirement, placeholder, and compliance references through the parent document.

## Workbook State

Workbook state is the user-entered and generated working data for one workspace or facility. It should be treated separately from the workbook definition.

Examples:

- Selected hazards and scores.
- Mitigation actions and owners.
- Annual review evidence.
- Imported JSON payloads.
- Completion status and validation warnings.
- Approved export snapshots.

## Boundary

Markdown remains the canonical document source for explanatory text and workbook definitions in v1. Workbook state should remain structured so it can be validated, diffed, audited, imported/exported, and rendered into print packets without turning Markdown into a fragile data store.

## State Storage Decision

Approved workbook state lives in structured sidecar JSON files linked to the parent document and workbook ID. It should not be embedded back into the parent Markdown document.

Sidecar files should carry:

- Schema version.
- Parent workspace ID.
- Parent document ID.
- Workbook ID and renderer template.
- Draft or approved status.
- Workbook payload.
- Validation summary.
- Audit metadata linking approvals, exports, and future Git commits.

Markdown remains the place for explanatory wrapper text and workbook definitions. Runtime-only drafts can stay outside committed history until they are approved through the review flow.

## Sidecar Paths

Approved state:

```text
workspaces/{workspace_id}/workbook-state/{document_id}/{workbook_id}/approved.json
```

Draft state:

```text
workspaces/{workspace_id}/runtime/workbook-state/{document_id}/{workbook_id}/draft.json
```

`runtime/` paths are local-only and ignored by Git. Approved sidecars are workspace content and should participate in the same future review, audit, and Git history model as approved document changes.

## Service Skeleton

The current local service skeleton exposes:

- `GET /api/workspaces/{workspace_id}/workbooks`
- `GET /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=approved|draft`
- `PUT /api/workspaces/{workspace_id}/workbooks/{document_id}/{workbook_id}/state?status=draft`

Generic approved writes are intentionally blocked until the review/apply workflow exists.

## HVA First Implementation

Appendix A / HVA should validate the class by covering:

- Guided hazard selection.
- Scoring and derived risk bands.
- Mitigation action planning.
- Annual review evidence.
- Local autosave.
- JSON import/export.
- Survey-ready print output.
- Appendix J linkage.
- Copyright guardrails from the source artifact.

## Non-Workbook Artifacts

Not every structured artifact is a workbook. Calculators, directories, logs, fixed forms, org charts, inventories, quizzes, and quick references can stay separate artifact families unless they need multi-step state, derived summaries, review packets, and import/export behavior comparable to a workbook.

## Resolved Design Questions

Q-0013: Should approved workbook state be stored in structured sidecar JSON files linked to the parent document, or embedded back into the parent Markdown document?

Answer: use structured sidecar JSON files for workbook state, while keeping workbook definitions and explanatory wrapper text in Markdown.

Q-0014: Should the HVA prototype start with a service-backed sidecar state skeleton, or with a front-end-only mock state?

Answer: start with a service-backed sidecar state skeleton. The UI can stay simple, but the state boundary is the thing future workbooks, audit, import/export, and history all depend on.

Q-0015: Should the first HVA UI prototype edit draft sidecar state directly, or remain read-only against approved sidecar state until review flow exists?

Answer: edit draft sidecar state directly, with a clear draft badge and no approved write path until review/apply exists.
