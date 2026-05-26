# Planning Section Chief

## Purpose
This support artifact defines the Planning Section Chief job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: planning_section_chief
  title: Planning Section Chief
  mission: Collect situation information, staffing information, projections, resident tracking information, and planning inputs needed for the incident action plan.
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
  - HICS 202B - Section Incident Objectives
  - HICS 213A - Emergency Evacuation Informational Messages
  - HICS 214A - Operations Log
  - HICS 252A - Section Personnel Time Sheet
  - HICS 257A - Resource Accounting Record
  - Department Rapid Assessment Form
  - Family Member and Pet Information
  - Labor Pool and Staff Log-in
  - Volunteer Staff Registration and Credentials Form
  - Resident / Medical Record and Equipment Tracking Sheet
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - collect current situation information from sections and departments
      - obtain resident census, staff status, and immediate service-continuity concerns
      - prepare short-range projections for command review
      - establish planning documentation and section log processes
      - activate the Labor Pool Unit Leader when staff reassignment is needed
  - id: ongoing_planning_actions
    label: Ongoing Planning Actions
    control: checklist
    items:
      - maintain the current situation picture and update command before briefings
      - collect section objectives, resource status, and unmet needs
      - support operational-period planning and incident action plan updates
      - coordinate staff information, labor pool data, and volunteer credentialing records
      - track resident movement and evacuation-related planning information when activated
      - document planning assumptions, projections, and unresolved information gaps
  - id: evacuation_support_actions
    label: Evacuation Support Actions
    control: checklist
    items:
      - support evacuation priority and feasibility analysis with current resident and staff information
      - coordinate labor pool staffing data needed for evacuation teams
      - support resident, medical record, and equipment tracking processes
      - advise command about projected staffing or capacity issues
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - compile planning records, projections, and section logs
      - identify planning assumptions that were inaccurate or need revision
      - submit records to the Documentation Recorder
review_questions:
  - Should labor pool data be integrated into the same digital planning dashboard?
  - Which projection intervals should be default fields for this facility?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Planning keeps command oriented to what is known, what is changing, and what may happen next.
- Staffing and resident movement data should be current enough to support command decisions.
- The Labor Pool Unit Leader supports Planning when staff reassignment or evacuation teams are needed.

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
