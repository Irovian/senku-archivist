# Stairwell Evacuation Team - Team Leader

## Purpose
This support artifact defines the Stairwell Evacuation Team - Team Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: stairwell_evacuation_team_leader
  title: Stairwell Evacuation Team - Team Leader
  mission: Coordinate resident movement through stairwells when vertical evacuation is required and elevators are unavailable or not authorized.
applicability: Use for multi-story areas where stairwell movement may be required.
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
  - Evacuation Floor Plans
  - Evacuation Equipment Inventory
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive assignment, stairwell, and destination briefing
      - confirm team members, communication method, and safety instructions
      - inspect the assigned stairwell for smoke, obstruction, crowding, or unsafe conditions
      - confirm evacuation devices or carry equipment are available if needed
      - coordinate with floor and discharge-floor teams before resident movement begins
      - report readiness or route barriers to the evacuation supervisor
  - id: stairwell_movement_actions
    label: Stairwell Movement Actions
    control: checklist
    items:
      - control resident movement pace and spacing in the assigned stairwell
      - use approved resident movement devices and body mechanics
      - coordinate rest points, relief staff, or alternate routes when needed
      - pause movement if staff fatigue, resident condition, or route safety becomes unsafe
      - coordinate handoff at the discharge floor or holding area
      - track residents moved through the assigned stairwell when assigned
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - report stairwell status, remaining residents, injuries, equipment issues, or route concerns
      - return evacuation equipment to the designated location when released
      - submit records to the assigned documentation point
review_questions:
  - Should this role be hidden for single-story facilities?
  - Which evacuation devices should appear as facility-specific equipment fields?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Stairwell movement is physically demanding and should be paced for resident and staff safety.
- The team leader should stop or slow movement when conditions become unsafe.
- Clear handoff at the discharge floor prevents residents from being lost in transition.

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
