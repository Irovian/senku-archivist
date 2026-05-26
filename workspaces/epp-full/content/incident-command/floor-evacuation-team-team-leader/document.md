# Floor Evacuation Team - Team Leader

## Purpose
This support artifact defines the Floor Evacuation Team - Team Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: floor_evacuation_team_leader
  title: Floor Evacuation Team - Team Leader
  mission: Coordinate the floor-level evacuation team that receives residents from units and moves them toward the assigned elevator, stairwell, discharge point, or holding area.
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
  - Resident Destination - To Holding Area Form
  - Resident Evacuation Tracking Form
  - Evacuation Floor Plans
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive assignment, route, and destination briefing
      - confirm team members, communication method, and safety instructions
      - review evacuation route, holding area destination, and resident handoff expectations
      - coordinate with nursing unit leadership before resident movement begins
      - confirm needed evacuation equipment is available
      - report readiness to the Labor Pool Unit Leader or command designee
  - id: resident_movement_actions
    label: Resident Movement Actions
    control: checklist
    items:
      - receive residents from unit staff using the assigned handoff process
      - move residents only along the route authorized for the incident
      - coordinate with elevator, stairwell, and discharge-floor teams as applicable
      - maintain resident dignity, identification, records, medications, equipment, and belongings during movement
      - pause movement and report immediately if route safety changes
      - track residents moved by the team using the assigned form or digital record
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - confirm all assigned rooms or areas have been cleared when directed
      - report remaining residents, barriers, equipment issues, or injuries
      - return team records to the assigned documentation point
review_questions:
  - Should this role card be customized by unit or floor?
  - Which route labels should appear as selectable fields in the digital version?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Floor evacuation teams move residents through assigned routes; nursing remains responsible for clinical preparation and resident-specific information.
- Resident handoff and tracking are as important as physical movement.
- Unsafe routes or missing equipment should be reported immediately.

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
