# Emergency Contractor / Vendor Lists

## Purpose
This support artifact defines the emergency contractor and vendor directory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The directory should maintain critical vendors and contractors for housekeeping, food service, transportation, maintenance, restoration, nursing, pharmacy, respiratory therapy, and other emergency support needs.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: vendor_directory
renderer_template: contractor-vendor-directory-v1
render_intent:
  digital: searchable vendor directory grouped by department, service, and local/backup source
  print: department-grouped vendor list for command-center and department reference
controls:
  - service category dropdown
  - department grouping
  - local/backup selector
  - phone inputs
  - 24/7 availability checkbox
  - agreement status dropdown
record_schema:
  id_prefix: emergency_vendor
  repeatable: true
  fields:
    - id: department_or_function
      label: Department or function
      control: dropdown
      required: true
      options: [housekeeping or linen, food service, transportation, maintenance, restoration, nursing, pharmacy, respiratory therapy, other]
    - id: source_type
      label: Source type
      control: dropdown
      options: [local source, backup source, regional source, system source]
    - id: service_or_product
      label: Service or product provided
      control: text
      required: true
    - id: vendor_name
      label: Vendor or contractor name
      control: text
      required: true
    - id: address
      label: Address
      control: textarea
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: after_hours_phone
      label: After-hours phone
      control: tel
    - id: email
      label: Email
      control: email
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [agreement in place, preferred vendor, needs confirmation, backup only, not applicable]
    - id: distance_or_region_notes
      label: Distance or region notes
      control: text
    - id: priority
      label: Priority
      control: dropdown
      options: [primary, secondary, alternate]
    - id: active
      label: Active vendor
      control: checkbox
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - department or function
  - source type
  - service or product
default_record_categories:
  - housekeeping and linen services
  - food services
  - resident transportation
  - maintenance services
  - building or restoration contractors
  - nursing support
  - pharmacy support
  - respiratory therapy support
review_questions:
  - Should local and backup sources be required for critical service categories?
  - Which vendor categories need evidence of agreement or MOU?
  - Should vendor distance or regional separation be captured as structured data?
```

## Maintenance
Review emergency vendors annually, after contract changes, after service failures, and after exercises that test vendor contact or backup-source availability.

## What Staff Should Understand
- Critical vendors should be searchable by department and service need.
- Backup vendors matter when local sources are unavailable during regional incidents.
- Agreement status and after-hours contacts should be kept current.

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
