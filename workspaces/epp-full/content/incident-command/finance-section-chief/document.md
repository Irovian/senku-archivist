# Finance Section Chief

## Purpose
This support artifact defines the Finance Section Chief job action sheet for {{facility_name}}. It is designed as a role-based action card that can be used digitally during an incident or rendered as a clean printable job action sheet.

## Artifact Use
The role card helps the assigned person understand the mission, reporting relationship, core forms, and action groups for the role. It preserves the function and intent of the legacy Section C job action sheet while avoiding the cramped legacy form layout.

The Incident Commander may activate this role when the incident scope requires it. The card should be available in the Command Center and in any digital role-assignment view used by the facility.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: job_action_sheet
renderer_template: job-action-sheet-v1
role:
  id: finance_section_chief
  title: Finance Section Chief
  mission: Track incident costs, procurement, contracts, time records, claims information, and financial documentation needed for response and recovery.
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
  - HICS 256A - Procurement Summary Report
action_groups:
  - id: immediate_actions
    label: Immediate Actions
    control: checklist
    items:
      - receive appointment and briefing from the Incident Commander
      - establish finance documentation for the incident and operational period
      - confirm approval process for emergency purchases, contracts, and resource commitments
      - begin tracking staff time, volunteer time, invoices, purchase orders, and unusual expenses
      - coordinate with Logistics on urgent procurement or vendor needs
      - advise command on financial documentation requirements
  - id: ongoing_finance_actions
    label: Ongoing Finance Actions
    control: checklist
    items:
      - maintain procurement and cost records by operational period
      - track contracts, emergency purchases, donations, and resource commitments
      - collect personnel time sheets and volunteer time documentation
      - support insurance, reimbursement, and claims documentation when applicable
      - flag purchases or commitments that require command approval
      - coordinate with Documentation Recorder for record retention
  - id: closeout_actions
    label: Closeout Actions
    control: checklist
    items:
      - compile incident cost summary and procurement records
      - identify missing time, purchase, invoice, or contract documentation
      - transfer finance records to the designated business office or command file location
review_questions:
  - Who approves emergency purchases if the Administrator is unavailable?
  - Should the digital version include vendor and purchase-order fields?
```

## Maintenance
The facility should review this role card annually, after exercises, and after incidents. Review should confirm role title, reporting relationship, linked forms, activation conditions, and whether any facility-specific assignment fields are needed.

## What Staff Should Understand
- Finance documentation starts during response, not after recovery begins.
- Emergency purchases and contracts should be traceable to command approval or urgent operational need.
- Personnel time and volunteer time may matter for reimbursement and after-action review.

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
