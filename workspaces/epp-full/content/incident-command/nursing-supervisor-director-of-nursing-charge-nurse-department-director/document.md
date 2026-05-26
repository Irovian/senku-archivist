# Nursing Supervisor / Director of Nursing / Charge Nurse / Department Director

## Purpose
This support artifact defines the unit or department evacuation oversight role for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: nursing_supervisor_or_department_director
  title: Nursing Supervisor / Director of Nursing / Charge Nurse / Department Director
  mission: Direct unit or department staff during full building evacuation, prepare residents for movement, and document resident transfer from the unit to the assigned holding area.
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
reports_to: Operations Section Chief or Incident Commander
linked_artifacts:
  - Resident Destination - To Holding Area Form
  - Resident Emergency Evacuation Information Tag
  - Resident Preparation Guides
  - Resident Evacuation Tracking Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive evacuation instructions and briefing from Operations or command
      - direct non-resident-care staff to the labor pool unless needed on the unit
      - direct resident-care staff to return to assigned resident care areas
      - begin resident preparation according to the applicable preparation guide
      - confirm resident identification, medical information, medications, records, equipment, and belongings processes
      - confirm the assigned holding area and handoff process before movement begins
  - id: resident_preparation_actions
    label: Resident Preparation Actions
    control: checklist
    items:
      - complete resident evacuation information tags or digital equivalents when required
      - ensure residents have identification and essential clinical information
      - package medical records, MARs, nursing notes, medications, and equipment according to facility process
      - assign staff to document each resident leaving the unit
      - request additional staff or equipment from the labor pool as needed
      - communicate resident-specific precautions to evacuation staff
  - id: unit_evacuation_actions
    label: Unit Evacuation Actions
    control: checklist
    items:
      - start movement only after evacuation groups and routes are ready
      - hand residents off to the assigned evacuation team with destination information
      - mark evacuated rooms using the facility-approved method
      - survey the area after evacuation to confirm all residents have left
      - account for unit staff and direct staff to the labor pool when released
      - return resident destination forms or digital records to the command documentation point
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - report unit evacuation status to Operations, holding areas, and command
      - report missing records, medications, belongings, equipment, or resident information
      - identify preparation or handoff issues for after-action review
review_questions:
  - Should this role card be split for nursing versus non-nursing department directors?
  - What method should the facility use to mark evacuated rooms?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Resident preparation is clinical and documentation work, not just physical movement.
- Movement should not begin until routes, teams, holding areas, and tracking processes are ready.
- Each resident handoff should include identification, destination, and essential clinical information.

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
