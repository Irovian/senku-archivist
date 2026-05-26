# Elevator Evacuation Team - Team Leader

## Purpose
This support artifact defines the Elevator Evacuation Team - Team Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: elevator_evacuation_team_leader
  title: Elevator Evacuation Team - Team Leader
  mission: Coordinate elevator-assisted resident movement when elevators are available, authorized, and safe to use during evacuation.
applicability: Use only when the facility has elevators and command or emergency responders authorize elevator use for the incident.
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
  - Elevator Key Control Information
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive assignment, elevator bank, and destination briefing
      - confirm elevator use has been authorized for the incident
      - confirm team members, communication method, and elevator safety instructions
      - coordinate with floor teams and discharge-floor teams before resident movement begins
      - confirm elevator keys, controls, or service mode needs when applicable
      - report readiness and limitations to the evacuation supervisor
  - id: elevator_movement_actions
    label: Elevator Movement Actions
    control: checklist
    items:
      - manage safe loading and unloading of residents, equipment, and staff
      - prioritize resident movement according to command direction and clinical needs
      - keep elevator pathways clear and controlled
      - stop elevator use immediately if safety, smoke, fire, power, or responder instructions change
      - coordinate handoff to discharge-floor or holding-area staff
      - track residents moved by elevator when assigned
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - report elevator status, remaining needs, and any safety concerns
      - return elevator keys or equipment to the designated control point
      - submit movement records to the assigned documentation point
review_questions:
  - Should this role be hidden for single-story facilities or facilities without elevators?
  - Who authorizes elevator use in the facility-specific plan?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Elevators are used only when authorized and safe for the specific incident.
- Elevator evacuation requires tight coordination with floor and discharge-floor teams.
- Any change in fire, smoke, power, or responder direction can stop elevator use.

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
