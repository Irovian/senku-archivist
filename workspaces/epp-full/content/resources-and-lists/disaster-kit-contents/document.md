# Disaster Kit Contents

## Purpose
This support artifact defines the disaster kit inventory checklist for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The checklist should identify the emergency kit location, actual kit contents, quantities, expiration dates, and items that need replenishment. Suggested legacy items should be treated as starting prompts, not a fixed final list.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: inventory_checklist
renderer_template: disaster-kit-inventory-v1
render_intent:
  digital: inventory checklist with categories, status, and replenishment prompts
  print: compact kit checklist with quantity and location columns
controls:
  - item records
  - quantity fields
  - location fields
  - status dropdown
  - expiration fields
  - reorder flag
record_schema:
  id_prefix: disaster_kit_item
  repeatable: true
  fields:
    - id: kit_location
      label: Kit location
      control: text
      required: true
    - id: category
      label: Category
      control: dropdown
      options: [first aid, infection control, lighting, communications, documentation, marking, safety, other]
    - id: item_name
      label: Item name
      control: text
      required: true
    - id: quantity
      label: Quantity
      control: number
    - id: unit
      label: Unit
      control: text
    - id: storage_location
      label: Storage location within kit
      control: text
    - id: expiration_or_review_date
      label: Expiration or review date
      control: date
    - id: status
      label: Status
      control: dropdown
      options: [available, low, expired, missing, replace, not applicable]
    - id: reorder_needed
      label: Reorder needed
      control: checkbox
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - kit location
  - category
  - status
default_record_categories:
  - first aid and basic clinical supplies
  - PPE and infection-control supplies
  - lighting and batteries
  - communication backup tools
  - documentation and marking supplies
  - barrier or scene-control materials
review_questions:
  - Should suggested legacy contents be preloaded as editable rows?
  - Who owns quarterly or annual kit checks?
  - Should expired and low-stock items create follow-up tasks?
```

## Maintenance
Review kit contents at least annually, after use, and before forecasted high-risk seasons. Replace expired, missing, or depleted items promptly.

## What Staff Should Understand
- The kit inventory should reflect actual stocked items.
- Suggested contents are prompts and should be replaced by facility-confirmed inventory.
- Low-stock and expired items should be visible before an incident occurs.

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
