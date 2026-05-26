# Holding Area Unit Leader

## Purpose
This support artifact defines the Holding Area Unit Leader job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: holding_area_unit_leader
  title: Holding Area Unit Leader
  mission: Set up and manage a holding area where residents are received, tracked, triaged, supported, and prepared for departure from the facility or movement to the next destination.
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
reports_to: Operations Section Chief and Triage Unit Leader
linked_artifacts:
  - Holding Area Supplies
  - Resident Evacuation Tracking Form
  - Resident / Medical Record and Equipment Tracking Sheet
  - Holding Area Resident Arrival Tracking Form
  - Holding Area Resident Departure Tracking Form
  - Staff and Equipment Tracking Form - Holding Area
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from Operations or the Triage Unit Leader
      - set up the assigned holding area and resident pick-up location as instructed
      - request needed staff through the Labor Pool Unit Leader
      - gather or request holding-area supplies, oxygen, suction, equipment, linens, disposables, and tracking materials
      - assign staff to resident arrival tracking and resident departure tracking
      - report readiness to Triage, Operations, and command
  - id: resident_arrival_actions
    label: Resident Arrival Actions
    control: checklist
    items:
      - record each resident arriving in the holding area
      - confirm resident identification, records, medications, belongings, and equipment accompany the resident
      - identify special care needs, isolation precautions, oxygen needs, mobility needs, or behavioral risks
      - communicate urgent resident issues to Operations or clinical leadership
      - maintain resident dignity, supervision, hydration, comfort, and safety while waiting
  - id: resident_departure_actions
    label: Resident Departure Actions
    control: checklist
    items:
      - record each resident departing the holding area and the destination or receiving facility
      - confirm transportation crew or family escort understands destination and special care needs
      - retain required copies of resident evacuation tags or tracking records
      - track staff and equipment leaving the facility with residents
      - coordinate family or physician notification documentation when assigned
      - continue status updates to Triage, Operations, and command
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - collect arrival, departure, resident tracking, and staff-equipment tracking records
      - return records to the Command Center when the holding area is deactivated
      - report unresolved resident, record, medication, equipment, or destination issues
review_questions:
  - Should holding-area arrival and departure tracking be one digital workflow?
  - Which supplies should appear as default holding-area checklist items?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- The holding area is a controlled tracking and care point, not just a waiting space.
- Residents should not depart without destination, transportation, records, and tracking information addressed.
- Holding-area records become part of the command documentation package.

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
