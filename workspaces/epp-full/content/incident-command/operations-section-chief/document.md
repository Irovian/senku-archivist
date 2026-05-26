# Operations Section Chief

## Purpose
This support artifact defines the Operations Section Chief job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: operations_section_chief
  title: Operations Section Chief
  mission: Coordinate resident care operations, clinical services, department response actions, resident movement, triage, holding areas, and evacuation operations.
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
  - Designated Area Locations and Telephones
  - HICS 213A - Emergency Evacuation Informational Messages
  - HICS 214A - Operations Log
  - HICS 252A - Section Personnel Time Sheet
  - HICS 257A - Resource Accounting Record
  - Department Rapid Assessment Form
  - Resident / Medical Record and Equipment Tracking Sheet
  - Evacuation Destination Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - assess resident care status, department status, and immediate clinical risks
      - request department rapid assessment forms from resident care areas and key departments
      - confirm resident census, high-risk residents, and urgent medical or behavioral needs
      - activate unit, triage, or holding-area leaders when needed
      - report immediate operational priorities to command
  - id: ongoing_operations_actions
    label: Ongoing Operations Actions
    control: checklist
    items:
      - coordinate resident care actions and department response priorities
      - maintain current status on resident safety, staffing needs, supplies, and service continuity
      - coordinate with Logistics for equipment, transportation, utilities, food, water, and supplies that affect care
      - coordinate with Planning for census, resident tracking, and staff assignment information
      - document section objectives, messages, resource needs, and personnel time
      - monitor staff fatigue, resident distress, and care continuity risks
  - id: evacuation_operations_actions
    label: Evacuation Operations Actions
    control: checklist
    items:
      - coordinate resident preparation, triage, holding areas, and resident tracking
      - activate Nursing Supervisor, Triage Unit Leader, and Holding Area Unit Leader roles when needed
      - coordinate evacuation priority and feasibility with command and other section chiefs
      - confirm medical records, medications, equipment, and resident belongings processes are active
      - coordinate resident destination documentation and handoff expectations
      - report evacuation status and barriers to command
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - confirm resident care operations are stable or transferred to recovery operations
      - collect operational logs, status reports, and resident tracking records
      - identify care-continuity issues for after-action review
review_questions:
  - Which clinical roles should be default child roles under Operations?
  - Should evacuation status be shown as a live dashboard in the digital version?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Operations owns the resident-care work of the response.
- Resident movement should remain tied to clinical readiness, tracking, and destination information.
- Operations should keep command informed about resident safety, staffing, and service continuity.

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
