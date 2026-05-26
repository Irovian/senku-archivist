# External Response Partners Phone Numbers

## Purpose
This support artifact defines the external response partner directory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The directory should maintain contacts for public agencies, utilities, infrastructure partners, inspection authorities, weather or poison resources, and other external partners that may support incident response.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: contact_directory
renderer_template: partner-contact-directory-v1
render_intent:
  digital: searchable external partner directory grouped by service area
  print: compact partner phone list for command-center reference
controls:
  - partner category dropdown
  - phone inputs
  - website fields
  - jurisdiction fields
  - active/inactive toggle
record_schema:
  id_prefix: external_partner_contact
  repeatable: true
  fields:
    - id: partner_category
      label: Partner category
      control: dropdown
      required: true
      options: [public health, utility, inspection, medical examiner, weather, environmental, transportation infrastructure, poison control, other]
    - id: organization_name
      label: Organization name
      control: text
      required: true
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: after_hours_phone
      label: After-hours phone
      control: tel
    - id: email
      label: Email
      control: email
    - id: website_or_portal
      label: Website or portal
      control: url
    - id: jurisdiction_or_service_area
      label: Jurisdiction or service area
      control: text
    - id: when_to_contact
      label: When to contact
      control: textarea
    - id: notes
      label: Notes
      control: textarea
    - id: active
      label: Active contact
      control: checkbox
display_groups:
  - partner category
  - service area
review_questions:
  - Which external partner categories are mandatory for the facility?
  - Should utilities also be linked from the utility shut-off matrix?
  - Should national hotline numbers be centrally managed rather than facility-entered?
```

## Maintenance
Review external response partner contact information annually and whenever service providers, regulators, utilities, or local partner agencies change.

## What Staff Should Understand
- External partners are broader than emergency responders and may be needed for utilities, public health, infrastructure, or recovery support.
- When-to-contact notes help staff choose the right partner during an incident.
- Partner records should be searchable by service area and category.

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
