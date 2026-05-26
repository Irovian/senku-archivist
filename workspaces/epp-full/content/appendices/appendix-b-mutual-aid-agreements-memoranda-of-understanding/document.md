# Appendix B - Mutual Aid Agreements / Memoranda of Understanding

## Purpose
This appendix defines the mutual aid agreement and memorandum tracker for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should support mutual aid, stop-over point, receiving-facility, and cooperative partner agreements used during emergency response. It should track who the agreement is with, what support is covered, whether an executed copy exists, and when the agreement should be reviewed.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: legal_template
renderer_template: mou-template-v1
render_intent:
  digital: agreement records with template fields, executed-copy attachments, and renewal prompts
  print: clean agreement template plus agreement inventory and signature blocks
controls:
  - party fields
  - service category checkboxes
  - term fields
  - attachment links
  - signature blocks
  - review status dropdown
record_schema:
  id_prefix: mutual_aid_agreement
  repeatable: true
  fields:
    - id: agreement_title
      label: Agreement title
      control: text
      required: true
    - id: partner_organization
      label: Partner organization
      control: text
      required: true
    - id: partner_contact_name
      label: Partner contact name
      control: text
    - id: partner_contact_phone
      label: Partner contact phone
      control: tel
    - id: covered_support
      label: Covered support
      control: multi_select
      options: [stop-over point, resident transfer, supplies, staff support, transportation, clinical support, other]
    - id: effective_date
      label: Effective date
      control: date
    - id: expiration_or_review_date
      label: Expiration or review date
      control: date
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [draft, under review, executed, expired, needs update]
    - id: executed_copy_attachment
      label: Executed copy attachment
      control: file
    - id: responsible_owner
      label: Responsible owner
      control: text
    - id: notes
      label: Notes
      control: textarea
clause_blocks:
  - id: purpose
    label: Purpose and emergency use
    editable: true
  - id: covered_services
    label: Covered services or support
    editable: true
  - id: coordination
    label: Communication and coordination
    editable: true
  - id: liability
    label: Legal review and responsibility
    editable: true
  - id: signature
    label: Signature and approval
    editable: true
review_questions:
  - Which agreement categories should be required for the facility?
  - Should executed-copy attachments be required before approval?
  - Who owns annual agreement review and renewal?
```

## Maintenance
Review agreements annually, before expiration, after partner changes, and after drills or incidents that reveal gaps in mutual aid or transfer support.

## What Staff Should Understand
- Agreement records should distinguish draft templates from executed agreements.
- Executed copies and review dates are the evidence surveyors and managers will need.
- Agreement content should receive appropriate administrative or legal review before use.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(4)`
- `§483.73(b)(2)-(7)`
- `E-0009`
- `E-0020`
- `E-0021`
- `E-0024`
- `E-0025`
