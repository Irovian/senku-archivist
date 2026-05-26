# Emergency Food Supply List

## Purpose
This support artifact defines the emergency food supply inventory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The inventory should identify emergency food supplies, where they are stored, how they can be accessed, and whether quantities and expiration dates remain current.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: resource_inventory
renderer_template: food-supply-inventory-v1
render_intent:
  digital: food inventory with expiration, dietary category, and access notes
  print: compact emergency food supply list grouped by storage location
controls:
  - food item records
  - quantity fields
  - unit fields
  - storage location fields
  - expiration dates
  - dietary category dropdown
record_schema:
  id_prefix: emergency_food_item
  repeatable: true
  fields:
    - id: storage_location
      label: Food supply storage location
      control: text
      required: true
    - id: access_or_key_location
      label: Access or key location
      control: text
    - id: item_name
      label: Food or supply item
      control: text
      required: true
    - id: quantity
      label: Quantity
      control: number
      required: true
    - id: unit
      label: Unit
      control: text
    - id: dietary_category
      label: Dietary category
      control: dropdown
      options: [regular, therapeutic diet, texture modified, hydration, infant or specialty, other]
    - id: expiration_date
      label: Expiration date
      control: date
    - id: rotation_required
      label: Rotation required
      control: checkbox
    - id: status
      label: Status
      control: dropdown
      options: [ready, low, expired, missing, replace]
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - storage location
  - dietary category
  - status
review_questions:
  - Should the inventory calculate days of supply by census later?
  - Should key/access location be hidden in public export views?
  - Who owns expiration-date review?
```

## Maintenance
Review emergency food inventory at least annually, after use, and according to facility food rotation or expiration-date procedures.

## What Staff Should Understand
- Emergency food records should be specific enough to support rapid access.
- Expiration and rotation information should be maintained before an incident.
- Access details may need different visibility in internal and external exports.

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
