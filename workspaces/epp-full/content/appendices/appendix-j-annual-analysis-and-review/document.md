# Appendix J - Annual Analysis and Review

## Purpose
This appendix defines the annual emergency preparedness analysis and review log for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should document the annual analysis and review of the emergency preparedness program, including reviewed components, findings, changes needed, action owners, and approval status.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: review_log
renderer_template: annual-analysis-review-log-v1
render_intent:
  digital: annual review log with component status, findings, action items, and approval record
  print: annual review evidence summary with action plan and signatures
controls:
  - component fields
  - date fields
  - reviewer fields
  - status dropdown
  - action item records
  - approval fields
record_schema:
  id_prefix: annual_review_item
  repeatable: true
  fields:
    - id: review_period
      label: Review period
      control: text
      required: true
    - id: program_component
      label: Program component
      control: dropdown
      required: true
      options: [risk assessment, policies and procedures, communication plan, training program, testing program, appendices and resources, after-action items, other]
    - id: review_date
      label: Review date
      control: date
    - id: reviewer_name
      label: Reviewer name
      control: text
    - id: reviewer_title
      label: Reviewer title
      control: text
    - id: finding_or_gap
      label: Finding or gap
      control: textarea
    - id: change_needed
      label: Change needed
      control: checkbox
    - id: action_item
      label: Action item
      control: textarea
    - id: action_owner
      label: Action owner
      control: text
    - id: target_completion_date
      label: Target completion date
      control: date
    - id: completion_status
      label: Completion status
      control: dropdown
      options: [not started, in progress, complete, deferred]
    - id: approval_signature
      label: Approval signature
      control: signature
display_groups:
  - program component
  - completion status
review_questions:
  - Which program components should be mandatory in every annual review?
  - Should this review log connect to policy document-control metadata?
  - Should action items feed the compliance calendar?
```

## Maintenance
Complete the review log at least annually and update action items until closed. Add findings from drills, real incidents, regulatory updates, and after-action reviews.

## What Staff Should Understand
- Annual review should show what was reviewed and what changed.
- Findings should become tracked action items when changes are needed.
- Approval and signature fields support governance and survey readiness.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(d)(2)`
- `E-0039`
