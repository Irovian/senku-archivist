# Appendix N - Contact Listing for Facility Physicians

## Purpose
This appendix defines the facility physician contact directory for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should maintain physician contact information needed for resident care coordination, emergency notifications, transfer planning, and clinical follow-up during incidents.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: contact_directory
renderer_template: physician-contact-directory-v1
render_intent:
  digital: searchable physician directory with coverage and contact details
  print: compact physician contact list for command and clinical staff
controls:
  - physician records
  - phone inputs
  - specialty fields
  - coverage fields
  - active/inactive toggle
record_schema:
  id_prefix: physician_contact
  repeatable: true
  fields:
    - id: name
      label: Name
      control: text
      required: true
    - id: role_or_service
      label: Role or service
      control: text
    - id: organization
      label: Organization
      control: text
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: after_hours_phone
      label: After-hours phone
      control: tel
    - id: email
      label: Email
      control: email
    - id: address
      label: Address
      control: textarea
    - id: active
      label: Active record
      control: checkbox
    - id: notes
      label: Notes
      control: textarea
    - id: specialty
      label: Specialty
      control: text
    - id: coverage_area_or_unit
      label: Coverage area or unit
      control: text
    - id: preferred_contact_method
      label: Preferred contact method
      control: dropdown
      options: [phone, secure message, email, office line, after-hours service]
display_groups:
  - specialty
  - coverage area
  - active status
review_questions:
  - Should physician contacts be imported from another system later?
  - Which fields are safe for printed downtime copies?
  - Should this directory link to resident medical information workflows?
```

## Maintenance
Review physician contacts annually and whenever medical director, attending physician, specialty coverage, phone, or after-hours contact information changes.

## What Staff Should Understand
- Physician contact records should be easy to search during resident-care decisions.
- Printed copies may need privacy-aware handling.
- Coverage and preferred contact method can matter during off-hours emergencies.

## Customization Tokens
- `{{facility_name}}`
- `{{state_ltc_ombudsman_contact}}`
- `{{primary_emergency_contact_name}}`

## Compliance References
- `§483.73(c)(1)`
- `E-0030`
