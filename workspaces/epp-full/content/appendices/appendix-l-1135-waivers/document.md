# Appendix L - 1135 Waivers

## Purpose
This appendix defines the 1135 waiver reference and action checklist for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should help leadership understand when 1135 waiver considerations may apply, what information to gather, which agencies or officials may be involved, and how alternate care site roles should be documented.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: reference_guide
renderer_template: waiver-reference-guide-v1
render_intent:
  digital: 1135 waiver guide with action checklist and context prompts
  print: reference guide and checklist for leadership use
controls:
  - reference sections
  - checklist items
  - agency contact fields
  - request status
  - documentation fields
record_schema:
  id_prefix: waiver_reference_item
  repeatable: true
  fields:
    - id: waiver_topic
      label: Waiver topic
      control: text
      required: true
    - id: when_to_consider
      label: When to consider
      control: textarea
    - id: required_context
      label: Required context
      control: repeatable_text
    - id: agency_or_official_contact
      label: Agency or official contact
      control: text
    - id: request_or_notice_status
      label: Request or notice status
      control: dropdown
      options: [not applicable, monitoring, requested, approved, denied, closed]
    - id: documentation_needed
      label: Documentation needed
      control: textarea
    - id: alternate_care_site_notes
      label: Alternate care site notes
      control: textarea
    - id: last_reviewed
      label: Last reviewed
      control: date
sections:
  - id: overview
    label: Plain-language overview
  - id: activation_context
    label: Emergency declaration and context
  - id: alternate_care_site
    label: Alternate care site role
  - id: documentation
    label: Documentation checklist
    repeatable: true
review_questions:
  - Should this guide include state-specific contacts or remain federal/general?
  - Who determines when waiver guidance needs legal or regulatory consultation?
  - Should alternate care site responsibilities link to the alternate care site policy?
```

## Maintenance
Review the guide annually and after regulatory updates, emergency declarations, or incidents where waiver flexibilities are considered.

## What Staff Should Understand
- 1135 waiver decisions require leadership and regulatory coordination.
- The guide should prompt documentation and context gathering, not replace official instructions.
- Alternate care site activity should be documented carefully.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(8)`
- `E-0026`
