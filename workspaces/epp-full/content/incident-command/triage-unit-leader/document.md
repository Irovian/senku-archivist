# Triage Unit Leader

## Purpose
This support artifact defines the Triage Unit Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: triage_unit_leader
  title: Triage Unit Leader
  mission: Determine the need for holding areas, assign holding-area leadership, and provide oversight of holding-area readiness, capacity, staffing, and triage flow.
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
reports_to: Operations Section Chief
linked_artifacts:
  - Holding Area Supplies
  - Holding Area Arrival Tracking Form
  - Holding Area Departure Tracking Form
  - Resident Evacuation Tracking Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Operations Section Chief
      - identify the number and type of holding areas needed
      - assign a Holding Area Unit Leader or coordinator for each active holding area
      - provide holding-area role materials and tracking forms
      - confirm holding-area locations, supplies, staffing, and communication methods
      - notify command when each holding area is ready to receive residents
  - id: ongoing_triage_actions
    label: Ongoing Triage Actions
    control: checklist
    items:
      - monitor holding-area capacity, acuity, staffing, and equipment needs
      - coordinate resources for holding areas through Operations, Logistics, and Labor Pool
      - confirm arrival and departure tracking procedures are functioning
      - advise command about holding-area capacity or safety concerns
      - monitor holding-area staff for exhaustion and psychological stress
      - coordinate deactivation of holding areas when authorized
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - confirm holding-area records are collected and submitted
      - report unresolved resident tracking, staffing, or equipment issues
      - identify holding-area process improvements for after-action review
review_questions:
  - Should holding-area types be preconfigured by resident population?
  - Which holding-area capacity fields should be required in the digital version?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Triage decides how many holding areas are needed and whether they are ready to receive residents.
- Holding-area capacity can change quickly and should be reported to command.
- Tracking must cover resident arrival, departure, destination, records, and equipment.

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
