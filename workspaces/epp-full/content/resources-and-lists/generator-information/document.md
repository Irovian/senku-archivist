# Generator Information

## Purpose
This support artifact defines the generator profile for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The profile should describe each emergency generator, the systems or areas it supports, fuel capacity, expected runtime, quick-connect capability, and portable-generator connection needs.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: generator_profile
renderer_template: generator-profile-v1
render_intent:
  digital: generator profiles with supported systems, fuel, runtime, and quick-connect information
  print: generator reference sheet for command, maintenance, and emergency power planning
controls:
  - generator records
  - system support checkboxes
  - fuel type dropdowns
  - runtime fields
  - quick-connect fields
  - parallel operation toggle
record_schema:
  id_prefix: generator
  repeatable: true
  fields:
    - id: generator_id
      label: Generator ID or label
      control: text
      required: true
    - id: area_or_equipment_served
      label: Area or equipment served
      control: textarea
      required: true
    - id: supported_systems
      label: Supported systems
      control: multi_select
      options: [life safety, critical resident care, heating or air conditioning, food service refrigeration, medication refrigeration, security systems, EHR or IT, other]
    - id: voltage_amperage_kw
      label: Voltage / amperage / kilowatts
      control: text
    - id: primary_fuel_type
      label: Primary fuel type
      control: dropdown
      options: [diesel, natural gas, propane, gasoline, other]
    - id: alternate_fuel_type
      label: Alternate fuel type
      control: dropdown
      options: [none, diesel, natural gas, propane, gasoline, other]
    - id: fuel_capacity
      label: Fuel capacity
      control: text
    - id: normal_runtime
      label: Normal runtime
      control: text
    - id: reduced_load_runtime
      label: Reduced-load runtime
      control: text
    - id: quick_connection_available
      label: Quick connection available
      control: checkbox
    - id: quick_connection_location
      label: Quick connection location
      control: text
    - id: portable_generator_cable_length
      label: Cable length needed for portable generator
      control: text
    - id: portable_generator_parking_location
      label: Portable generator parking location
      control: text
    - id: parallel_operation_available
      label: Can operate in parallel with other generators
      control: checkbox
    - id: service_vendor
      label: Service vendor
      control: text
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - generator ID
  - supported systems
  - fuel type
review_questions:
  - Should supported systems be standardized to match the emergency power policy?
  - Should runtime calculations be linked to fuel-vendor records?
  - Should quick-connect details be restricted in external exports?
```

## Maintenance
Review generator information annually, after generator service changes, after load testing, after fuel-system changes, and whenever emergency power capabilities change.

## What Staff Should Understand
- Generator records should tell command what will and will not be powered.
- Runtime and fuel information should be current enough for operational decisions.
- Quick-connect and portable-generator details may need restricted visibility.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `§483.73(c)`
- `§483.73(c)(1)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `§483.73(e)(1)-(3)`
- `E-0015`
- `E-0029`
- `E-0030`
- `E-0031`
- `E-0032`
- `E-0041`
