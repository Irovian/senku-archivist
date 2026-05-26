# Appendix O - Entities Providing Services Under Arrangement

## Purpose
This appendix defines the services-under-arrangement provider directory for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should maintain entities that provide services to the facility under arrangement, including service or product, routine and emergency contact methods, agreement status, and continuity notes.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: vendor_directory
renderer_template: entities-under-arrangement-directory-v1
render_intent:
  digital: provider directory grouped by service, continuity risk, and agreement status
  print: compact services-under-arrangement list for emergency operations
controls:
  - provider records
  - service category dropdown
  - phone inputs
  - 24-hour contact fields
  - agreement status
  - continuity notes
record_schema:
  id_prefix: service_under_arrangement
  repeatable: true
  fields:
    - id: service_or_product
      label: Service or product
      control: text
      required: true
    - id: provider_name
      label: Provider name
      control: text
      required: true
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: twenty_four_hour_contact
      label: 24-hour contact
      control: tel
    - id: email
      label: Email
      control: email
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [agreement in place, preferred provider, needs confirmation, backup only, not applicable]
    - id: criticality
      label: Criticality
      control: dropdown
      options: [critical, important, routine, unknown]
    - id: backup_provider
      label: Backup provider
      control: text
    - id: continuity_notes
      label: Continuity notes
      control: textarea
    - id: active
      label: Active provider
      control: checkbox
display_groups:
  - service or product
  - criticality
  - agreement status
review_questions:
  - Which under-arrangement services are critical for continuity of operations?
  - Should backup providers be required for critical services?
  - Should this appendix merge with or link to Section F vendor records?
```

## Maintenance
Review service provider records annually, after contract changes, after vendor performance issues, and after service-continuity risk changes.

## What Staff Should Understand
- Under-arrangement providers can be critical to continuity of operations.
- Emergency contact methods should be separate from routine contact information.
- Critical services should have backup planning where possible.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(3)`
- `§483.73(b)`
- `E-0007`
- `E-0013`
