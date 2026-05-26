# Labor Pool Unit Leader

## Purpose
This support artifact defines the Labor Pool Unit Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: labor_pool_unit_leader
  title: Labor Pool Unit Leader
  mission: Set up and manage the labor pool, register available staff and volunteers, track assignments, and deploy staff to incident roles or evacuation teams as directed.
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
reports_to: Planning Section Chief
linked_artifacts:
  - Labor Pool and Staff Log-in
  - Volunteer Staff Registration and Credentials Form
  - Evacuation Team Log-In Form
  - Section Personnel Time Sheet
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Planning Section Chief
      - set up the labor pool at the designated location
      - confirm sign-in, credentialing, and assignment tracking materials are available
      - direct arriving staff to sign in before assignment
      - identify staff skills, department, availability, and physical limitations
      - report available staffing capacity to Planning and command
  - id: ongoing_labor_pool_actions
    label: Ongoing Labor Pool Actions
    control: checklist
    items:
      - match staff and volunteers to requested assignments based on skill and urgency
      - track who is assigned, where they report, and when they are released
      - coordinate relief, meal breaks, and rest needs for assigned staff
      - maintain volunteer credentialing and supervision documentation
      - escalate unmet staffing requests to Planning
      - document staff time or volunteer time as required
  - id: evacuation_team_actions
    label: Evacuation Team Actions
    control: checklist
    items:
      - assemble evacuation teams requested by command or Operations
      - assign team leaders for floor, elevator, stairwell, and discharge-floor teams when needed
      - provide evacuation team log-in records and assignment instructions
      - track staff sent to holding areas, resident care units, routes, or discharge points
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - collect labor pool sign-in, assignment, and release records
      - account for staff and volunteers assigned through the labor pool
      - submit records to Planning and the Documentation Recorder
review_questions:
  - What is the default primary labor pool location for this facility?
  - Should volunteer credentialing be a separate linked artifact?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- The labor pool should be a controlled assignment point, not an informal gathering area.
- Staff should not self-deploy without being recorded and assigned.
- Volunteer credentials and supervision expectations should be documented.

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
