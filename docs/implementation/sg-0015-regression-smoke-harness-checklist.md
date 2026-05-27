# SG-0015 Build Checklist: Archivist Regression And Smoke Harness

## Artifact Role

This checklist is the build handoff for `SG-0015`. The canonical state remains
`.project-brain/backlog/items/SG-0015.json`; this file is the readable build
map for the lightweight local harness.

## Agreed Harness Shape

- Use lightweight local smoke tooling for the first harness.
- Prefer Python stdlib scripts, existing npm commands, curl-compatible service
  checks, and `/usr/bin/google-chrome` headless screenshots.
- Do not introduce Playwright, Cypress, cloud CI, daemon runners, screenshot
  baselines, or persistent visual diff approvals in this slice.
- Write disposable evidence under `.tmp/archivist-smoke/<run-id>/` or an
  equivalent ignored local evidence folder.
- Fail clearly when required local capabilities are unavailable; do not
  silently skip primary service or browser coverage.

## Commands To Add

- [x] `npm run smoke:service`
- [x] `npm run smoke:browser`
- [x] `npm run smoke:all`

The combined command should include the existing safety checks where practical:

- [x] `npm run build`
- [x] `npm run check:epp-source-leaks`
- [x] `npm run check:epp-references`
- [x] service smoke
- [x] desktop browser smoke

Current implementation: `npm run smoke:all` runs the build, SG-0007 source
leak check, SG-0007 reference check, service smoke, and desktop browser smoke.
Disposable evidence is written under `.tmp/archivist-smoke/<run-id>/`.

## Service Smoke Coverage

- [x] `GET /api/status` reports the Archivist local service.
- [x] `GET /api/workspaces` returns discoverable workspaces without staging
      candidates.
- [x] `GET /api/workspaces/epp-full` returns the live full EPP workspace.
- [x] `GET /api/workspaces/epp-full/navigation` returns all 261 imported
      documents.
- [x] Navigation reports expected library counts: EPP 177, Survey Guidance 52,
      CFR 32.
- [x] `DOC-GOVERNANCE_AND_PLANNING-POLICY_AND_ORGANIZATIONAL_STATEMENTS`
      returns rendered compatibility output.
- [x] `DOC-APPENDICES-APPENDIX_A` returns rendered compatibility output, stable
      anchors, source/compliance orientation, and `hva-workbook-v1` artifact
      context.
- [x] `REG-SOMZ-E-0001` returns rendered compatibility output and anchors.
- [x] `REG-CFR-42-483-73` returns rendered compatibility output and anchors.
- [x] `DOC-EVACUATION-EVACUATION_FLOOR_PLANS` remains reachable and returns a
      clear missing-Markdown fallback payload.
- [x] Service responses do not expose app-facing source-file paths or raw
      staging import candidates.

## Browser Smoke Coverage

Use a desktop viewport such as `1440x1000`.

- [x] Default/full EPP route screenshot.
- [x] Appendix A direct URL screenshot.
- [x] Survey Guidance direct URL screenshot.
- [x] CFR direct URL screenshot.
- [x] Service-required retry-state screenshot after temporarily stopping or
      withholding the service.
- [x] Visible markers are asserted for selected library, selected nav document,
      reader title, orientation panels, and Appendix A workbook entry point.
- [x] Scripts start and stop their own service/Vite child processes when needed
      and do not leave background listeners behind.

## Evidence Contract

Each smoke run should print:

- [x] run id
- [x] commands executed
- [x] service base URL
- [x] app URL
- [x] screenshot paths
- [x] pass/fail summary

Machine-readable output may be JSON so future build evidence can copy it into
project-brain without retyping.

## Future Expansion Points

- [ ] Renderer parity sample set for SG-0003.
- [ ] HVA workbook flows for SG-0008.
- [ ] Proposal/review flows for SG-0014.
- [ ] History/audit checks after those surfaces are implemented.
- [ ] Optional formal browser framework only after smoke coverage proves stable.
