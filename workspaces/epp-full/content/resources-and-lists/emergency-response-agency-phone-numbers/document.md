# Emergency Response Agency Phone Numbers

## Purpose
This support artifact defines the emergency response agency directory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The directory should keep emergency and non-emergency contact methods for response agencies, emergency management contacts, ombudsman contacts, and other sources of assistance that may be needed during activation.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: contact_directory
renderer_template: agency-contact-directory-v1
render_intent:
  digital: searchable agency contacts grouped by emergency function
  print: compact agency phone list with emergency and non-emergency columns
controls:
  - phone inputs
  - agency category dropdown
  - emergency/non-emergency fields
  - jurisdiction fields
  - repeatable records
record_schema:
  id_prefix: agency_contact
  repeatable: true
  fields:
    - id: agency_type
      label: Agency type
      control: dropdown
      required: true
      options: [EMS, fire, emergency management, law enforcement, public health, ombudsman, relief agency, other]
    - id: agency_name
      label: Agency name
      control: text
      required: true
    - id: emergency_phone
      label: Emergency phone
      control: tel
    - id: non_emergency_phone
      label: Non-emergency phone
      control: tel
    - id: contact_name
      label: Contact name
      control: text
    - id: title_or_unit
      label: Title or unit
      control: text
    - id: jurisdiction
      label: Jurisdiction
      control: text
    - id: email
      label: Email
      control: email
    - id: notes
      label: Notes
      control: textarea
    - id: active
      label: Active contact
      control: checkbox
display_groups:
  - agency type
  - jurisdiction
review_questions:
  - Which agency types should be required before approval?
  - Should emergency and non-emergency numbers be visually separated in print?
  - Should ombudsman contact information live here, in Emergency Contacts, or both?
```

## Maintenance
Verify response-agency contact information annually, after local agency changes, and after exercises where contact attempts reveal inaccurate information.

## What Staff Should Understand
- Emergency and non-emergency numbers serve different purposes and should not be blended.
- Agency contacts should be grouped by function for fast lookup.
- Outdated agency numbers can delay notifications and resource requests.

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
