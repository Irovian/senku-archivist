# Safety / Security / Liaison Officer

## Purpose
This support artifact defines the Safety / Security / Liaison Officer job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: safety_security_liaison_officer
  title: Safety / Security / Liaison Officer
  mission: Coordinate safety, security, traffic control, hazard monitoring, and outside-agency liaison activities during the incident.
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
  - Independent Living Resident Departure Tracking Form
  - HICS 205A - Communications List (Internal)
  - HICS 205A - Communications List (External / Emergency Agencies)
  - HICS 213A - Incident Message Form
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - assess immediate safety and security threats to residents, staff, visitors, and responders
      - coordinate facility access control, traffic flow, and parking controls
      - establish liaison contact with emergency responders and emergency management when applicable
      - confirm communication methods for outside agencies and healthcare partners
      - advise command on lockdown, restricted access, evacuation route, or hazardous-material concerns
  - id: ongoing_safety_and_liaison_actions
    label: Ongoing Safety and Liaison Actions
    control: checklist
    items:
      - monitor changing hazards and report safety concerns to command
      - coordinate with law enforcement, fire, EMS, public health, and emergency management contacts
      - support staging areas for responders, families, media, or transportation as assigned
      - coordinate traffic and security support for evacuation movement if evacuation is activated
      - document agency contacts, resource requests, and liaison messages
      - watch staff and responders for exhaustion or unsafe work practices
  - id: evacuation_support_actions
    label: Evacuation Support Actions
    control: checklist
    items:
      - coordinate emergency services involvement in evacuation decisions and movement
      - support safe internal routes, discharge points, and vehicle approach paths
      - confirm that receiving-facility communication occurs before public destination updates
      - report blocked routes, security risks, or responder instructions to command
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - summarize outside-agency contacts and unresolved safety issues
      - return security controls to normal operations when authorized
      - submit liaison notes and safety documentation to the Documentation Recorder
review_questions:
  - Should safety, security, and liaison be split into separate role cards for larger facilities?
  - Which agencies should appear as default quick-contact buttons?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- This role combines safety, security, and liaison functions unless the Incident Commander separates them.
- Outside-agency messages and resource requests should be documented.
- Security decisions should stay coordinated with command and emergency responders.

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
