# SG-0007 Build Checklist: EPP Import Cleanup

## Artifact Role

This is the implementation checklist for `SG-0007`. It is not a separate Senku canonical artifact type; the canonical state remains the backlog item, decision records, requirements, questions, and session record under `.project-brain/`.

Use this checklist as the build-prep handoff for refreshing the app-facing `epp-full` workspace before `SG-0013` restores the browser shell.

## Source Inputs

- `.project-brain/backlog/items/SG-0007.json`
- `.project-brain/decisions/DEC-SG-0006.json`
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
- `scripts/import_epp_workspace.py`
- `workspaces/epp-full/workspace.json`
- `workspaces/epp-full/project/`
- `workspaces/epp-full/sources/regulatory/`

Original source repo:

- `/home/irovian/Dovaxis - DevOps/Emergency Prep Project`

## Guardrails

- Do not rewrite canonical Markdown content under `workspaces/epp-full/content`.
- Do not scan canonical Markdown document bodies as part of the SG-0007 source-leak check.
- Do not remove retained regulatory sources under `workspaces/epp-full/sources/regulatory`.
- Do not retain `workspaces/epp-full/source-files` in the refreshed app workspace.
- Do not retain a raw upstream `catalog.json` copy with development-only original source file paths inside Archivist v1.
- Do not leave copied/missing original source-file counters or paths in `workspace.json`.
- Do not expose original source file paths, browse targets, download targets, or attachment semantics from provenance-only records.
- Do not expose absolute local paths to the original EPP source checkout in app-facing workspace metadata.
- Do not retain development-only original source annotations as app-facing extracted context.
- Do not silently leave dangling references to removed source annotations, removed source-files paths, or removed raw source paths.
- Do not use a generic `source_count` field or message that blurs retained regulatory sources with provenance-only source records.
- Do not wipe `audit/ledger.jsonl`, `workbook-state/`, draft workbook state, `runtime/`, or existing approved/draft sidecars during normal import refresh.
- Do not write raw source paths, development-only source filenames, source-files paths, source_path values, browse targets, or download targets into import audit events.
- Do not partially mutate the live `workspaces/epp-full` workspace before candidate import validation passes.
- Do not expose staging import candidates through app workspace discovery or service browse endpoints.
- Do not turn SG-0007 into a React/browser rendering slice.

## Checklist

### 1. Importer Boundary

- [ ] Update `scripts/import_epp_workspace.py` so import refresh no longer copies original office/catalog source files into `workspaces/epp-full/source-files`.
- [ ] If `workspaces/epp-full/source-files` exists from a previous import, remove it during refresh.
- [ ] Keep copying canonical Markdown content into `workspaces/epp-full/content`.
- [ ] Keep copying project data needed for navigation, search, compliance, placeholders, artifacts, requirements, and retained regulatory-source views.
- [ ] Keep copying extracted source context needed by the app.
- [ ] Remove or normalize development-only original source annotations under `workspaces/epp-full/extracts/source-annotations`.
- [ ] Keep retained regulatory extracted context when it supports CFR or Survey Guidance app views.
- [ ] Keep `workspaces/epp-full/sources/regulatory` because it feeds CFR and Survey Guidance app views.
- [ ] Treat `audit/`, `workbook-state/`, draft workbook state, and `runtime/` as app-owned state, not imported source surfaces.
- [ ] Seed missing workbook sidecars only when absent; do not overwrite existing approved or draft sidecars.
- [ ] Keep `workspaces/epp-seed` unchanged as a fast scaffold fixture.

### 2. Staging And Promotion

- [ ] Build the refreshed `epp-full` candidate in a non-app-facing staging area.
- [ ] Ensure staging paths are not discoverable as app workspaces.
- [ ] Run candidate cleanup, source record normalization, metadata sanitization, source-leak checks, and reference-integrity checks before touching live imported surfaces.
- [ ] If candidate import or validation fails, leave the existing live `workspaces/epp-full` workspace usable.
- [ ] If candidate import or validation fails, do not append a success import audit event.
- [ ] Promote only after candidate checks pass.
- [ ] During promotion, replace imported surfaces such as content, project metadata, retained regulatory sources, scoped extracted context, and workspace manifest fields.
- [ ] During promotion, preserve app-owned `audit/`, `workbook-state/`, draft workbook state, and `runtime/` data.
- [ ] Clean up or clearly isolate stale staging output after success or failure.
- [ ] Report candidate failure details in command output rather than retaining raw diagnostics in app-facing workspace state.

### 3. Workspace Manifest

- [ ] Remove `canonical_source.original_source_files_path` or any equivalent app-facing source-files path from `workspaces/epp-full/workspace.json`.
- [ ] Remove `import_summary.copied_original_source_files`.
- [ ] Remove `import_summary.missing_original_source_files`.
- [ ] Replace generic `import_summary.source_count` with explicit count fields.
- [ ] Preserve `import_summary.document_count`.
- [ ] Add or preserve `import_summary.provenance_source_count` for provenance-only source records.
- [ ] Add or preserve `import_summary.retained_regulatory_source_count` for retained regulatory sources.
- [ ] Do not count provenance-only source stubs as retained source files.
- [ ] Preserve `canonical_source.content_path`.
- [ ] Preserve `canonical_source.project_data_path`.
- [ ] Preserve `canonical_source.extracted_source_path`.
- [ ] Preserve `canonical_source.regulatory_source_path`.
- [ ] Preserve `canonical_source.workbook_state_path` and draft workbook-state path.
- [ ] Preserve source repo commit/branch provenance in `source_reference`.
- [ ] Replace any absolute original source checkout path in app-facing `source_reference` with a non-browseable human label.
- [ ] Keep the original source checkout path usable as an importer CLI/default value, but not as app-facing workspace metadata.
- [ ] Ensure `document_count` still matches the imported EPP catalog document count.

### 4. App-Owned State Preservation

- [ ] Preserve `workspaces/epp-full/audit/ledger.jsonl` across normal import refresh.
- [ ] Preserve existing approved workbook state under `workspaces/epp-full/workbook-state/`.
- [ ] Preserve existing draft workbook sidecars when present.
- [ ] Preserve `workspaces/epp-full/runtime/` or equivalent runtime data when present.
- [ ] If expected workbook sidecars are missing, create them non-destructively.
- [ ] Report preserved app-owned state and seeded sidecars separately from imported content/source cleanup counts.
- [ ] Leave destructive workspace resets to a future explicit reset command, not `npm run import:epp`.

### 5. Sanitized Import Audit Event

- [ ] Preserve the existing `workspaces/epp-full/audit/ledger.jsonl` file.
- [ ] Append one sanitized import-refresh event after a successful validated promotion.
- [ ] Use a stable event type such as `workspace_import_refreshed`.
- [ ] Include explicit counts such as `document_count`, `provenance_source_count`, `retained_regulatory_source_count`, `preserved_state_count`, and `seeded_workbook_sidecar_count`.
- [ ] Include cleanup validation statuses for source-leak and reference-integrity checks.
- [ ] Include source kind, branch, commit, import timestamp, and non-browseable source label when available.
- [ ] Do not include the original source checkout path or any absolute local path.
- [ ] Do not include development-only source filenames, `source-files` paths, original `source_path` values, browse targets, or download targets.
- [ ] Print a matching console summary using the same sanitized labels.
- [ ] Keep detailed developer diagnostics in failing command output only; do not retain raw diagnostics in app-facing audit state.

### 6. Catalog Normalization

- [ ] Treat `workspaces/epp-full/project/catalog.json` as the normalized app-facing catalog.
- [ ] Do not retain a second raw upstream catalog copy inside `workspaces/epp-full`.
- [ ] Preserve document IDs, titles, content groups, content types, lifecycle/status metadata, document paths to canonical Markdown, requirements, placeholders, and source IDs.
- [ ] Normalize original office/catalog source records to non-browseable provenance stubs.
- [ ] Keep stable source IDs for traceability.
- [ ] Keep human-readable labels/status when useful.
- [ ] Remove original office/catalog file paths such as `.docx`, `.xlsx`, and `.xls` from app-facing source records.
- [ ] Remove or avoid open targets, download targets, attachment targets, retained-file flags, and source-files-relative paths for original office/catalog sources.
- [ ] Ensure document `source_ids` still resolve either to provenance-only source stubs or retained regulatory sources.

### 7. Project Metadata Sanitization

- [ ] Sanitize all copied app-facing project metadata under `workspaces/epp-full/project`, not only `catalog.json`.
- [ ] Normalize crosswalk metadata so it does not expose original office/catalog source paths.
- [ ] Normalize search metadata so it does not expose original office/catalog source paths.
- [ ] Normalize compliance metadata so it does not expose original office/catalog source paths.
- [ ] Normalize source metadata so it does not expose original office/catalog source paths.
- [ ] Preserve stable document IDs, source IDs, requirement IDs, CFR IDs, E-tag IDs, and relationship IDs needed by the app.
- [ ] Preserve retained regulatory-source metadata needed for CFR and Survey Guidance views.
- [ ] Prefer IDs and non-browseable labels over raw file paths when retaining provenance.

### 8. Source-Leak Check

- [ ] Add a repeatable post-import source-leak check command.
- [ ] Prefer an explicit script and npm wrapper, such as `python3 scripts/check_epp_workspace_source_leaks.py workspaces/epp-full` and `npm run check:epp-source-leaks`.
- [ ] The check should run against the staged candidate before promotion.
- [ ] The check should scan app-facing workspace metadata, manifests, project metadata, app-facing extracted context, and service-response inputs.
- [ ] The check should scan import audit events under `workspaces/epp-full/audit/ledger.jsonl`.
- [ ] The check should not scan canonical Markdown document bodies under `workspaces/epp-full/content`.
- [ ] The check should allow retained regulatory source data under `workspaces/epp-full/sources/regulatory`.
- [ ] The check should fail on disallowed markers such as `.docx`, `.xlsx`, `.xls`, `source-files`, `source_path`, `original_source_files_path`, `copied_original_source_files`, and `missing_original_source_files` outside explicitly allowed locations.
- [ ] The check should fail on absolute local original-source checkout paths in app-facing metadata.
- [ ] The check should fail on raw open/download target fields for development-only original sources.
- [ ] The check should report the file path and offending marker when it fails.
- [ ] The check should pass after a clean SG-0007 refresh.

### 9. Reference Integrity

- [ ] Add a post-cleanup reference-integrity check.
- [ ] The integrity check should run after source-file removal, source record normalization, project metadata sanitization, and source annotation cleanup.
- [ ] The integrity check should run against the staged candidate before promotion.
- [ ] The integrity check should fail if retained app-facing metadata points to removed source annotations.
- [ ] The integrity check should fail if retained app-facing metadata points to removed `source-files` paths.
- [ ] The integrity check should fail if retained app-facing metadata points to removed raw source paths.
- [ ] The integrity check should fail if document `source_ids` point to missing source records.
- [ ] The integrity check should pass when references resolve to retained documents, retained regulatory sources, or normalized provenance stubs.
- [ ] The integrity check should report unresolved references with enough file, field, source ID, and document ID context to fix them.
- [ ] The importer should either rewrite affected references to retained IDs/provenance stubs or fail; it should not silently drop them.

### 10. Refresh Command

- [ ] Run `npm run import:epp`.
- [ ] Confirm the import command builds a staged candidate before promoting imported surfaces.
- [ ] Confirm failed candidate import or validation leaves the existing live `workspaces/epp-full` usable.
- [ ] Confirm the import command removes stale `workspaces/epp-full/source-files`.
- [ ] Confirm the import command leaves `workspaces/epp-full/sources/regulatory` present.
- [ ] Confirm the import command preserves `audit/ledger.jsonl`, existing workbook sidecars, draft workbook state, and runtime data.
- [ ] Confirm the import command writes a normalized `workspaces/epp-full/workspace.json`.
- [ ] Confirm the import command writes sanitized project metadata.
- [ ] Confirm the import command still seeds workbook sidecars where expected.
- [ ] Confirm workbook sidecar seeding is non-destructive when approved or draft state already exists.
- [ ] Confirm the import command appends one sanitized import event to `audit/ledger.jsonl`.
- [ ] Confirm the success import event is appended only after validated promotion.
- [ ] Confirm the import command output no longer reports copied original source files as a success metric.
- [ ] Confirm the import command output distinguishes document count, provenance-only source count, and retained regulatory source count.
- [ ] Confirm the import command output reports preserved state and seeded sidecars without raw source paths or development-only source filenames.
- [ ] Confirm the import command fails with a clear report if cleanup leaves unresolved app-facing references.
- [ ] Confirm failed candidate import or validation does not retain raw diagnostics in app-facing workspace state.

### 11. Validation

- [ ] Run `npm run import:epp`.
- [ ] Confirm staging output is not discoverable as an app workspace.
- [ ] Confirm candidate validation runs before live promotion.
- [ ] Run the post-import source-leak check.
- [ ] Run the post-cleanup reference-integrity check.
- [ ] Confirm `workspaces/epp-full/source-files` is absent.
- [ ] Confirm `workspaces/epp-full/sources/regulatory` is present.
- [ ] Confirm `workspaces/epp-full/workspace.json` does not advertise original source-file paths or copied/missing original-source counters.
- [ ] Confirm `workspaces/epp-full/workspace.json` does not expose an absolute local original-source checkout path.
- [ ] Confirm `workspaces/epp-full/workspace.json` does not use generic `source_count`.
- [ ] Confirm source counts are explicit, including provenance-only source records and retained regulatory sources.
- [ ] Confirm `workspaces/epp-full/audit/ledger.jsonl` is preserved across refresh.
- [ ] Confirm approved workbook sidecars, draft workbook state, and runtime data are preserved across refresh.
- [ ] Confirm missing workbook sidecars are seeded without overwriting existing approved or draft state.
- [ ] Confirm a successful refresh appends one sanitized import event to `workspaces/epp-full/audit/ledger.jsonl`.
- [ ] Confirm the import event includes explicit count fields, cleanup validation statuses, preserved-state status, and seeded-sidecar counts.
- [ ] Confirm the import event contains no raw source paths, development-only source filenames, source-files paths, `source_path` values, browse targets, or download targets.
- [ ] Confirm development-only original source annotations under `workspaces/epp-full/extracts/source-annotations` are absent or normalized without original `source_path` values.
- [ ] Confirm `workspaces/epp-full/project/catalog.json` is normalized app-facing metadata.
- [ ] Confirm no raw upstream catalog copy with development-only original source file paths is retained in `workspaces/epp-full`.
- [ ] Confirm copied app-facing project metadata no longer exposes development-only original office/catalog source paths.
- [ ] Confirm document `source_ids` resolve to provenance-only source stubs or retained regulatory source records.
- [ ] Confirm no retained app-facing references point to removed source annotations, removed source-files paths, or removed raw source paths.
- [ ] Force or simulate a candidate validation failure and confirm the live workspace remains usable with no success import audit event appended.
- [ ] Run `python3 ${CODEX_HOME:-$HOME/.codex}/skills/senku-prep/scripts/brain.py validate`.
- [ ] Run `git diff --check`.

## Definition Of Done

`SG-0007` is done when `npm run import:epp` builds a staged candidate, validates it before promotion, and rebuilds `workspaces/epp-full` as an app-facing workspace with canonical content, sanitized project metadata, retained app-facing extracted context, retained regulatory sources, absent development-only `source-files`, absent or normalized development-only original source annotations, normalized provenance-only original source records, explicit source count fields, no app-facing absolute original-source checkout paths, preserved app-owned audit/workbook/draft/runtime state, non-destructive sidecar seeding when needed, one sanitized import audit event per successful validated promotion, a passing automated source-leak check, a passing reference-integrity check, and failure behavior that leaves the live workspace usable.

## Follow-On Work

- `SG-0013`: restore the full EPP browser shell and navigation using the cleaned app-facing workspace.
- `SG-0015`: broaden local smoke/regression coverage after the browser shell is restored.
- Future content review: address any user-facing historical worksheet/source-name mentions inside canonical Markdown bodies if they prove confusing.
