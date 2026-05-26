# Facility Information Detail

## Purpose
This support artifact defines the facility information profile for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The profile should give command staff a reliable snapshot of facility identity, contact channels, command-center locations, average daily census, alert systems, and regional reporting systems. It should be easy to update when contact information or command-center locations change.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: facility_profile
renderer_template: facility-profile-v1
render_intent:
  digital: editable facility profile with command-center and alert-system sections
  print: compact facility snapshot for command-center binders
controls:
  - text inputs
  - number inputs
  - phone inputs
  - email inputs
  - location fields
  - alert-system dropdowns
record_schema:
  id_prefix: facility_profile
  repeatable: true
  fields:
    - id: facility_name
      label: Facility name
      control: text
      required: true
    - id: address
      label: Address
      control: textarea
      required: true
    - id: county
      label: County
      control: text
    - id: fire_department
      label: Fire department
      control: text
    - id: average_resident_census
      label: Average resident census
      control: number
    - id: average_staff_count
      label: Average staff count
      control: number
    - id: average_visitor_count
      label: Average visitor count
      control: number
    - id: main_phone
      label: Main phone
      control: tel
    - id: main_fax
      label: Main fax
      control: tel
    - id: command_center_phone
      label: Command center phone
      control: tel
    - id: command_center_fax
      label: Command center fax
      control: tel
    - id: failsafe_phone
      label: Failsafe or backup phone
      control: tel
    - id: command_center_email
      label: Command center email
      control: email
    - id: primary_command_center
      label: Primary command center location
      control: text
    - id: alternate_command_center
      label: Alternate command center location
      control: text
    - id: alert_sources
      label: Emergency alert sources
      control: multi_select
      options: [radio, television, weather alert, regional portal, other]
    - id: regional_reporting_system
      label: Regional or state reporting system
      control: text
review_questions:
  - Which census fields should be maintained as fixed profile fields?
  - Should command-center phone and fax be separate from the general facility contact fields?
  - Which regional reporting or healthcare coalition system should be named for this facility?
```

## Maintenance
Review the facility profile annually and whenever facility contact channels, command-center locations, alert systems, ownership, or reporting-system expectations change.

## What Staff Should Understand
- This profile is the quick command-center reference for facility identity and communication basics.
- The profile should be maintained as data, not as a static page.
- Average counts should be reviewed when census or staffing patterns materially change.

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
