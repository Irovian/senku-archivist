# Emergency Bedding Materials

## Purpose
This support artifact defines the emergency bedding materials inventory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The inventory should identify stored bedding materials available for surge, sheltering, staff support, or resident relocation needs, including quantity, storage location, and current usability.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: resource_inventory
renderer_template: resource-inventory-v1
render_intent:
  digital: inventory cards grouped by material type and storage location
  print: compact bedding inventory with quantity and location columns
controls:
  - equipment records
  - quantity fields
  - location fields
  - status dropdown
  - surge-use flag
record_schema:
  id_prefix: bedding_material
  repeatable: true
  fields:
    - id: material_type
      label: Material type
      control: dropdown
      required: true
      options: [mattress, pillow, bed, blanket, linen, other]
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
    - id: in_daily_use
      label: In daily use
      control: checkbox
    - id: available_for_surge
      label: Available for surge or sheltering
      control: checkbox
    - id: condition_status
      label: Condition status
      control: dropdown
      options: [ready, needs cleaning, damaged, missing, retired]
    - id: owner_department
      label: Owner department
      control: text
    - id: last_verified
      label: Last verified
      control: date
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - material type
  - storage location
  - status
review_questions:
  - Should daily-use items be excluded from emergency availability counts?
  - Who owns verification of bedding material counts?
  - Should staff-sheltering supplies be separated from resident supplies?
```

## Maintenance
Review bedding material counts annually, after use, after storage moves, and before planned sheltering or surge exercises.

## What Staff Should Understand
- Inventory should distinguish stored emergency materials from items already in daily use.
- Location accuracy matters when staff need supplies quickly.
- Damaged or missing materials should trigger replenishment follow-up.

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
