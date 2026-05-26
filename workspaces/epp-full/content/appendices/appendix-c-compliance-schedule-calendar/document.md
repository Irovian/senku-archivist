# Appendix C - Compliance Schedule / Calendar

## Purpose
This appendix defines the emergency preparedness compliance calendar for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should track recurring emergency preparedness tasks such as annual plan review, training, exercises, testing, policy updates, contact list review, and evidence retention.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: compliance_calendar
renderer_template: compliance-calendar-v1
render_intent:
  digital: compliance calendar with due dates, recurrence, owners, and evidence links
  print: annual compliance schedule grouped by month or requirement area
controls:
  - recurring task records
  - date fields
  - frequency dropdowns
  - owner fields
  - status dropdowns
  - evidence attachments
record_schema:
  id_prefix: compliance_task
  repeatable: true
  fields:
    - id: task_name
      label: Task name
      control: text
      required: true
    - id: requirement_area
      label: Requirement area
      control: dropdown
      options: [risk assessment, policies and procedures, communication plan, training, testing, annual review, other]
    - id: frequency
      label: Frequency
      control: dropdown
      options: [annual, semiannual, quarterly, monthly, after incident, as needed]
    - id: owner_role
      label: Owner role
      control: text
    - id: due_date
      label: Due date
      control: date
    - id: completion_date
      label: Completion date
      control: date
    - id: status
      label: Status
      control: dropdown
      options: [not started, in progress, complete, overdue, deferred]
    - id: evidence_attachment
      label: Evidence attachment
      control: file
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - requirement area
  - frequency
  - status
outputs:
  - calendar_view
  - overdue_task_list
  - annual_review_packet
review_questions:
  - Should tasks be preloaded from CMS E-tags?
  - Should overdue items create reminders in BrightSource later?
  - Which evidence types should be attached to each task?
```

## Maintenance
Update the calendar whenever required tasks are completed, assigned, rescheduled, or changed by policy, regulation, drill findings, or after-action review.

## What Staff Should Understand
- The calendar is a management control, not a policy narrative.
- Evidence should be attached or linked where possible.
- Recurring tasks should drive annual review readiness.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(d)(2)`
- `E-0039`
