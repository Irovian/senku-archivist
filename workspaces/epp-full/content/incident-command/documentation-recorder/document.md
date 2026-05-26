# Documentation Recorder

## Purpose
This support artifact defines the Documentation Recorder job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: documentation_recorder
  title: Documentation Recorder
  mission: Maintain the written incident record, collect command forms and logs, preserve decisions and action items, and support after-action documentation.
assignment_fields:
  - id: operational_period_date
    label: Operational period date
    control: date
  - id: start_time
    label: Start time
    control: time
  - id: end_time
    label: End time
    control: time
  - id: assigned_to
    label: Assigned to
    control: text
  - id: alternate
    label: Alternate
    control: text
  - id: telephone
    label: Telephone
    control: tel
  - id: radio_title
    label: Radio title
    control: text
  - id: command_center_location
    label: Command center location
    control: text
reports_to: Incident Commander
linked_artifacts:
  - HICS 201A - Incident Briefing
  - HICS 202A - Incident Objectives
  - HICS 202B - Section Incident Objectives
  - HICS 213A - Incident Message Form
  - HICS 214A - Operations Log
  - Department Rapid Assessment Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - set up the command documentation station and event log
      - confirm where incoming forms, messages, and status reports will be delivered
      - start the master incident record with date, time, incident name, and operational period
      - make needed copies of incident forms and role materials
      - record initial objectives, major decisions, and assignments
  - id: ongoing_documentation_actions
    label: Ongoing Documentation Actions
    control: checklist
    items:
      - maintain a running log of command decisions and unresolved action items
      - collect department rapid assessment forms and section status updates
      - track HICS 213A messages, responses, and forwarding decisions
      - organize section logs and forms by operational period
      - support briefings by preparing current documentation for the Incident Commander
      - flag missing forms or undocumented decisions for follow-up
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - collect final logs and forms from activated sections
      - prepare the documentation package for retention and after-action review
      - identify documentation gaps, late forms, and follow-up items
      - transfer the incident record to the designated command file location
review_questions:
  - Are the listed command forms the right minimum set for this role card?
  - Should the digital version include a live running log control?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- The incident record starts as soon as command is activated.
- Messages, decisions, assignments, and status reports should be traceable by time and operational period.
- The Documentation Recorder supports the response but does not approve operational decisions.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(3)`
- `§483.73(c)`
- `§483.73(c)(3)`
- `§483.73(d)`
- `E-0007`
- `E-0029`
- `E-0032`
- `E-0036`
