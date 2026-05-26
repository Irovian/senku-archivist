# Emergency Transport Equipment to Move Residents

## Purpose
This support artifact defines the resident transport equipment inventory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The inventory should identify equipment available to move residents during evacuation or relocation, including quantities, storage locations, capacity limits, and maintenance readiness.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: resource_inventory
renderer_template: transport-equipment-inventory-v1
render_intent:
  digital: transport-equipment inventory grouped by equipment type and location
  print: compact movement equipment list for evacuation teams
controls:
  - equipment type dropdown
  - quantity fields
  - location fields
  - maintenance status
  - capacity notes
record_schema:
  id_prefix: resident_transport_equipment
  repeatable: true
  fields:
    - id: equipment_type
      label: Equipment type
      control: dropdown
      required: true
      options: [wheelchair, stretcher, lift, evacuation chair, evacuation sled, other]
    - id: item_description
      label: Item description
      control: text
    - id: quantity
      label: Quantity
      control: number
      required: true
    - id: storage_location
      label: Storage location
      control: text
      required: true
    - id: assigned_area
      label: Assigned area
      control: text
    - id: weight_or_use_limit
      label: Weight or use limit
      control: text
    - id: battery_or_power_needed
      label: Battery or power needed
      control: checkbox
    - id: maintenance_status
      label: Maintenance status
      control: dropdown
      options: [ready, needs inspection, out of service, missing]
    - id: last_verified
      label: Last verified
      control: date
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - equipment type
  - storage location
  - maintenance status
review_questions:
  - Should the inventory distinguish daily-use equipment from emergency-only equipment?
  - Should equipment be linked to evacuation routes or resident acuity categories?
  - Who verifies lift and evacuation-device readiness?
```

## Maintenance
Review transport equipment counts, locations, and readiness annually, after evacuation drills, after equipment moves, and after use.

## What Staff Should Understand
- Resident movement equipment must be available where teams can find it.
- Equipment status should show whether an item is ready for use.
- Resident movement planning depends on both quantity and type of equipment.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `§483.73(c)`
- `§483.73(c)(1)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `§483.73(c)(8)`
- `E-0015`
- `E-0029`
- `E-0030`
- `E-0031`
- `E-0032`
- `E-0035`
