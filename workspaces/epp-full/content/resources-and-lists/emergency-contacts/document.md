# Emergency Contacts

## Purpose
This support artifact defines the emergency contact directory for {{facility_name}}. It supports emergency communication with designated primary, secondary, and alternate contacts and prepares the information for digital directory use and printable output.

## Artifact Use
The directory should help command staff quickly identify who to contact, how to reach them, and which contact is primary for emergency coordination. It should be maintained as structured records rather than a static page of blank lines.

The primary facility emergency contact is {{primary_emergency_contact_name}}. State long-term care ombudsman contact information is maintained separately as {{state_ltc_ombudsman_contact}} when needed for emergency communication.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: contact_directory
renderer_template: emergency-contact-directory-v1
render_intent:
  digital: searchable contact cards with emergency priority badges
  print: compact directory grouped by contact priority
controls:
  - text inputs
  - phone inputs
  - email inputs
  - role/category dropdown
  - repeatable records
  - active/inactive toggle
record_schema:
  id_prefix: emergency_contact
  repeatable: true
  fields:
    - id: contact_priority
      label: Contact priority
      control: dropdown
      required: true
      options: [primary, secondary, alternate, backup]
    - id: name
      label: Name
      control: text
      required: true
    - id: title
      label: Title or role
      control: text
    - id: department_or_function
      label: Department or function
      control: text
    - id: email
      label: Email
      control: email
    - id: work_phone
      label: Work phone
      control: tel
    - id: mobile_phone
      label: Mobile phone
      control: tel
    - id: home_phone
      label: Home phone
      control: tel
    - id: other_contact_method
      label: Other contact method
      control: text
    - id: after_hours_available
      label: Available after hours
      control: checkbox
    - id: active
      label: Active contact
      control: checkbox
      default: true
display_groups:
  - primary
  - secondary
  - alternate
  - backup
review_questions:
  - Should home phone remain a visible field, or should it be hidden unless the facility uses it?
  - Should contacts be grouped only by priority, or also by department/function?
  - Should this directory replace the static emergency contact page in Section F?
```

## Maintenance
Emergency contacts should be reviewed at least annually and whenever leadership, contact information, or emergency responsibilities change. The facility should confirm that after-hours contact methods remain current.

## What Staff Should Understand
- Emergency contacts should be stored as repeatable records, not hard-coded into a static page.
- The digital version should support search and filtering.
- The printable version should remain compact and usable during downtime.
- Contact information should be protected according to facility privacy and workforce information practices.

## Customization Tokens
- `{{facility_name}}`
- `{{primary_emergency_contact_name}}`
- `{{state_ltc_ombudsman_contact}}`

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
