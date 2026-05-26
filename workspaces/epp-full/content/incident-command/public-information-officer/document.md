# Public Information Officer

## Purpose
This support artifact defines the Public Information Officer job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: public_information_officer
  title: Public Information Officer
  mission: Prepare and coordinate approved incident messages for resident representatives, families, staff, media, and public-facing communication channels.
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
  - HICS 213A - Incident Message Form
  - Emergency Evacuation Informational Messages
  - Pre-Scripted Messages
  - Resident and Responsible Party Emergency Communications Plan
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - confirm who may approve public or family-facing messages
      - review current facts, known uncertainties, and message restrictions
      - prepare initial holding statement or family update when directed
      - coordinate with command before using media, website, recorded phone line, or mass notification channels
      - confirm where families or media should be directed if they arrive onsite
  - id: ongoing_message_actions
    label: Ongoing Message Actions
    control: checklist
    items:
      - draft updates using approved facts and plain language
      - coordinate resident and responsible-party information with Operations and command
      - track message versions, approval status, release time, and release channel
      - monitor rumor, conflicting information, or repeat questions that need command clarification
      - support staff-facing informational updates when assigned by command
      - preserve released messages for the incident record
  - id: evacuation_message_actions
    label: Evacuation Message Actions
    control: checklist
    items:
      - prepare evacuation information only after receiving-facility communication is confirmed
      - coordinate family and representative updates with resident placement and tracking processes
      - avoid announcing receiving sites until command authorizes release
      - use pre-scripted messages as a starting point and tailor to current facts
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - prepare final approved update or transition message when directed
      - submit message records to the Documentation Recorder
      - identify message gaps or communication barriers for after-action review
review_questions:
  - Which communication channels should be included in the digital release checklist?
  - Should family-message scripts be a separate artifact linked from this role card?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- The Public Information Officer coordinates approved messages; the role does not create independent public statements.
- Family, representative, media, and website updates should match the facts approved by command.
- Evacuation destinations should not be publicly released before receiving-facility communication is confirmed.

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
