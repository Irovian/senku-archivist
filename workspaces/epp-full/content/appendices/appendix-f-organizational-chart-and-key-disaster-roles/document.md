# Appendix F - Organizational Chart and Key Disaster Roles

## Purpose
This appendix defines the key disaster roles organizational chart for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should show key disaster roles and assignments outside the detailed incident-command role cards. It should help the facility maintain primary and alternate role coverage for emergency preparedness leadership and coordination.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: org_chart
renderer_template: key-disaster-roles-chart-v1
render_intent:
  digital: role chart with assignments, alternates, and contact fields
  print: clean disaster roles chart with assignment blanks
controls:
  - role nodes
  - assigned person fields
  - alternate fields
  - contact fields
  - role category filters
  - print layout controls
record_schema:
  id_prefix: key_disaster_role
  repeatable: true
  fields:
    - id: role_id
      label: Role ID
      control: text
      required: true
    - id: role_title
      label: Role title
      control: text
      required: true
    - id: role_category
      label: Role category
      control: dropdown
      options: [command, clinical, operations, logistics, communications, planning, finance, external coordination, other]
    - id: primary_position_or_person
      label: Primary position or person
      control: text
    - id: alternate_position_or_person
      label: Alternate position or person
      control: text
    - id: phone
      label: Phone
      control: tel
    - id: email
      label: Email
      control: email
    - id: reports_to
      label: Reports to
      control: text
    - id: responsibility_summary
      label: Responsibility summary
      control: textarea
    - id: active_in_print_chart
      label: Show in print chart
      control: checkbox
display_groups:
  - role category
  - reports to
review_questions:
  - Should this chart duplicate ICS roles or focus on broader disaster-plan leadership?
  - Which roles should be shown on the one-page print view?
  - Should assignments use position titles rather than person names by default?
```

## Maintenance
Review key disaster roles annually, after leadership changes, after exercises, and whenever the incident-command or succession structure changes.

## What Staff Should Understand
- This chart should make role ownership easy to see and update.
- Role assignments may use position titles, named people, or both depending on facility preference.
- This appendix should link cleanly to incident-command role cards.

## Customization Tokens
- `{{collaborative_partners}}`
- `{{facility_name}}`
- `{{local_response_agencies}}`
- `{{plan_owner_title}}`

## Compliance References
- `§483.73(a)(3)`
- `E-0007`
