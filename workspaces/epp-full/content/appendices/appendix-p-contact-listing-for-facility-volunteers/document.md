# Appendix P - Contact Listing for Facility Volunteers

## Purpose
This appendix defines the facility volunteer contact directory for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should maintain volunteer contact information, potential emergency roles, availability, skills, credential status, and supervision notes for emergency support.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: contact_directory
renderer_template: volunteer-contact-directory-v1
render_intent:
  digital: searchable volunteer contact directory with skills, availability, and credential fields
  print: compact volunteer contact list for command and labor pool use
controls:
  - volunteer records
  - phone inputs
  - role and skill fields
  - availability fields
  - credential status
record_schema:
  id_prefix: volunteer_contact
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
    - id: volunteer_role
      label: Volunteer role
      control: text
    - id: skills_or_credentials
      label: Skills or credentials
      control: textarea
    - id: availability
      label: Availability
      control: text
    - id: credential_verified
      label: Credential verified
      control: checkbox
    - id: supervision_required
      label: Supervision required
      control: checkbox
    - id: last_contact_verified
      label: Last contact verified
      control: date
display_groups:
  - volunteer role
  - credential status
  - availability
review_questions:
  - Should volunteers be separated by credentialed and non-credentialed roles?
  - Which volunteer information is appropriate for printed copies?
  - Should this directory link to the Labor Pool Unit Leader role card?
```

## Maintenance
Review volunteer contacts annually, after volunteer roster changes, after credential changes, and before exercises or high-risk seasons where volunteer support may be needed.

## What Staff Should Understand
- Volunteer records should show skills, availability, and supervision needs.
- Credential verification matters before volunteers are assigned sensitive work.
- Volunteer deployment should stay coordinated with the labor pool or command process.

## Customization Tokens
- `{{facility_name}}`
- `{{state_ltc_ombudsman_contact}}`
- `{{primary_emergency_contact_name}}`

## Compliance References
- `§483.73(c)(1)`
- `E-0030`
