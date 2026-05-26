# Incident Commander

## Purpose
This support artifact defines the Incident Commander job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The Incident Commander job action sheet supports the person directing the facility response. It should be available in the command center and should be easy to scan during high-pressure incidents.

This pilot preserves the role intent of the legacy job action sheet while moving the content into a reusable action-card model with structured assignment fields, action groups, linked forms, and review checkpoints.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: incident_commander
  title: Incident Commander
  mission: Direct the facility incident response, set objectives, assign command roles, protect resident and staff safety, and authorize major protective actions.
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
  - id: command_center_location
    label: Command center location
    control: text
  - id: telephone
    label: Telephone
    control: tel
  - id: radio_title
    label: Radio title
    control: text
reports_to: Command Center
linked_artifacts:
  - Incident Command System Organizational Chart
  - Incident Action Plan Quick Start
  - Incident Objectives
  - Incident Message Form
  - Department Rapid Assessment Form
  - Unit or Area Evacuation Status documentation
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - assume_or_assign_incident_command
      - read_applicable_hazard_or_evacuation_procedure
      - activate_needed_command_roles
      - establish_initial_objectives
      - call_initial_command_briefing
      - request_department_status_reports
      - confirm resident census and immediate safety concerns
      - confirm communication methods and documentation owner
  - id: intermediate_actions
    label: Intermediate Actions
    control: checklist
    items:
      - authorize needed resources
      - schedule recurring command briefings
      - update incident objectives
      - coordinate regulatory or agency notifications when applicable
      - monitor staff fatigue and relief needs
      - confirm time and cost tracking for extended response
  - id: evacuation_actions
    label: Full Building Evacuation Actions
    control: checklist
    items:
      - activate full building evacuation process when indicated
      - coordinate evacuation decision with emergency services when available
      - ensure labor pool and holding areas are established
      - ensure internal and external transportation are assigned
      - confirm receiving-facility communication before public destination updates
      - confirm resident tracking, medical records, medications, and belongings processes
      - authorize evacuation start when holding areas, teams, and transportation are ready
  - id: demobilization_actions
    label: Demobilization and Recovery Actions
    control: checklist
    items:
      - confirm command objectives are complete or transferred
      - authorize deactivation or transition to recovery
      - collect incident documentation
      - identify after-action issues and improvement needs
review_questions:
  - Are the action groups in the right order for a printable one-page role card?
  - Which linked forms should be shown as buttons in the digital version?
  - Should evacuation actions stay on this role card or move to a separate evacuation supplement?
```

## Maintenance
The facility should review this role card annually, after drills, and after incidents. Review should confirm role titles, linked forms, communication expectations, evacuation decision authority, and documentation expectations.

## What Staff Should Understand
- The Incident Commander role may begin before the full command team is activated.
- Objectives, assignments, and major decisions should be documented from the start.
- The role card should be concise enough for incident use and structured enough for digital tracking.
- Facility-specific position titles and alternates can be added without changing the role intent.

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
