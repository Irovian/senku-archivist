# Elevator Keys

## Purpose
This support artifact defines the elevator key control table for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The table should identify where elevator keys are kept, which elevators they control, and which role or department has around-the-clock access during an emergency.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: key_control_table
renderer_template: elevator-key-control-v1
render_intent:
  digital: key-control records with access roles and elevator coverage
  print: restricted key-control reference for authorized staff
applicability: Use only for facilities with elevators or elevator access controls.
controls:
  - key records
  - elevator selector
  - location fields
  - 24/7 access role
  - backup key flag
  - conditional facility visibility
record_schema:
  id_prefix: elevator_key
  repeatable: true
  fields:
    - id: key_id_or_label
      label: Key ID or label
      control: text
      required: true
    - id: key_location
      label: Key location
      control: text
      required: true
    - id: elevator_controlled
      label: Elevator controlled
      control: text
      required: true
    - id: building_or_area
      label: Building or area
      control: text
    - id: access_role
      label: Who has 24/7 access
      control: text
      required: true
    - id: backup_key_available
      label: Backup key available
      control: checkbox
    - id: restricted_information
      label: Restricted information
      control: checkbox
    - id: last_verified
      label: Last verified
      control: date
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - building or area
  - key location
review_questions:
  - Should this artifact be hidden for single-story or no-elevator facilities?
  - Should detailed key locations be suppressed in external-facing exports?
  - Who verifies key access after staff or security changes?
```

## Maintenance
Review elevator key records annually, after security changes, after elevator service changes, and after changes to authorized access roles.

## What Staff Should Understand
- Key-location information may be sensitive and should be shown only to appropriate users.
- Elevator key access should be available during off-hours.
- Elevator key information should connect to elevator evacuation planning.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `§483.73(c)`
- `§483.73(c)(1)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `E-0015`
- `E-0029`
- `E-0030`
- `E-0031`
- `E-0032`
