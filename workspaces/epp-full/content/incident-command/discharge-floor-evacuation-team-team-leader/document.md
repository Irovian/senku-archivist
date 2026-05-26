# Discharge Floor Evacuation Team - Team Leader

## Purpose
This support artifact defines the Discharge Floor Evacuation Team - Team Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: discharge_floor_evacuation_team_leader
  title: Discharge Floor Evacuation Team - Team Leader
  mission: Coordinate resident handoff at the discharge floor and move residents from vertical routes to holding areas, discharge points, or transportation staging.
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
reports_to: Labor Pool Unit Leader or assigned evacuation supervisor
linked_artifacts:
  - Evacuation Team Log-In Form
  - Resident Evacuation Tracking Form
  - Resident Destination - To Holding Area Form
  - Holding Area Arrival Tracking Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive assignment, discharge point, and destination briefing
      - confirm team members, communication method, and route expectations
      - coordinate with floor, elevator, stairwell, holding-area, and transportation staff
      - prepare the discharge point for safe resident handoff and movement
      - confirm equipment needed for wheelchair, stretcher, or assisted movement
      - report readiness or barriers to the evacuation supervisor
  - id: discharge_floor_actions
    label: Discharge Floor Actions
    control: checklist
    items:
      - receive residents from elevator, stairwell, or floor teams
      - confirm resident identification and destination information during handoff
      - move residents to the assigned holding area or transportation staging point
      - keep discharge routes clear and prevent crowding
      - report residents who arrive without records, medications, equipment, or belongings
      - track handoffs using the assigned form or digital record
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - confirm discharge point is clear when released
      - report unresolved resident tracking or equipment issues
      - submit handoff records to the assigned documentation point
review_questions:
  - Which exits should be selectable discharge points?
  - Should discharge-floor tracking merge with holding-area arrival tracking in the digital version?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- This role is the bridge between vertical movement and holding-area or transportation flow.
- Resident identification and destination information should be confirmed at each handoff.
- Crowding at discharge points can slow evacuation and create safety risk.

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
