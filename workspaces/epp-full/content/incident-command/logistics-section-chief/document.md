# Logistics Section Chief

## Purpose
This support artifact defines the Logistics Section Chief job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: logistics_section_chief
  title: Logistics Section Chief
  mission: Coordinate facility systems, maintenance, supplies, food, water, transportation resources, communications equipment, and other logistical support for the response.
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
  - HICS 213A - Incident Message Form
  - HICS 251A - Facility Systems Status Report
  - HICS 252A - Section Personnel Time Sheet
  - HICS 257A - Resource Accounting Record
  - Department Rapid Assessment Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - assess facility systems, utilities, building damage, and immediate resource needs
      - assign maintenance or support staff to complete facility systems status reports
      - confirm communication equipment and backup communication options for command
      - identify urgent supply, food, water, equipment, waste, and transportation issues
      - report immediate logistical barriers to command
  - id: ongoing_logistics_actions
    label: Ongoing Logistics Actions
    control: checklist
    items:
      - develop section objectives and resource priorities for the operational period
      - coordinate repair, maintenance, utility, supply, food, water, and waste support
      - track requested, received, deployed, and depleted resources
      - coordinate transportation resource needs with Operations and Safety/Security/Liaison
      - support staff sheltering or staff-family support needs when assigned by command
      - document section personnel time and resource use
  - id: evacuation_support_actions
    label: Evacuation Support Actions
    control: checklist
    items:
      - support internal movement equipment, external transportation staging, and discharge points
      - coordinate supplies and equipment needed at holding areas and evacuation routes
      - advise command about building systems or utility conditions that affect evacuation feasibility
      - support movement of records, medications, equipment, and essential supplies when assigned
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - summarize resource use, unresolved repairs, and replenishment needs
      - return borrowed equipment and document lost or damaged resources
      - submit logistics records to the Documentation Recorder and Finance Section Chief as applicable
review_questions:
  - Should transportation coordination sit primarily with Logistics or Safety/Security/Liaison in this facility?
  - Which facility systems should be required fields on the digital status view?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Logistics owns the support conditions that make resident care and evacuation possible.
- Resource requests should be tracked from request through deployment or denial.
- Transportation support should stay coordinated with Operations and command.

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
