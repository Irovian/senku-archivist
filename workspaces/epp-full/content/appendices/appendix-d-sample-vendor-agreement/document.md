# Appendix D - Sample Vendor Agreement

## Purpose
This appendix defines the vendor agreement template and tracker for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should support emergency vendor agreements for supplies, services, transportation, maintenance, restoration, food, fuel, or other critical support. It should track service scope, term, emergency availability, and evidence of agreement.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: legal_template
renderer_template: vendor-agreement-template-v1
render_intent:
  digital: vendor agreement records with service scope, status, and renewal fields
  print: clean vendor agreement template with signature blocks
controls:
  - party fields
  - service fields
  - term fields
  - agreement status
  - signature blocks
  - attachment links
record_schema:
  id_prefix: vendor_agreement
  repeatable: true
  fields:
    - id: vendor_name
      label: Vendor name
      control: text
      required: true
    - id: service_or_product
      label: Service or product
      control: text
      required: true
    - id: vendor_contact
      label: Vendor contact
      control: text
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: emergency_phone
      label: Emergency phone
      control: tel
    - id: emergency_availability
      label: Emergency availability
      control: dropdown
      options: [24/7, business hours, on call, unknown]
    - id: term_start
      label: Term start
      control: date
    - id: term_end_or_review_date
      label: Term end or review date
      control: date
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [draft, under review, executed, expired, needs update]
    - id: executed_copy_attachment
      label: Executed copy attachment
      control: file
    - id: notes
      label: Notes
      control: textarea
clause_blocks:
  - id: scope
    label: Scope of services
    editable: true
  - id: emergency_access
    label: Emergency access and priority
    editable: true
  - id: contact
    label: Communication and ordering process
    editable: true
  - id: documentation
    label: Documentation and invoices
    editable: true
  - id: signature
    label: Signature and approval
    editable: true
review_questions:
  - Which vendor categories should use this agreement template?
  - Should this appendix link to the Section F vendor directory records?
  - What approval or legal review status is required before use?
```

## Maintenance
Review vendor agreements annually, before expiration, after vendor changes, and after incidents or drills that reveal service gaps.

## What Staff Should Understand
- Vendor agreements should show emergency availability and evidence status.
- Agreement records should connect to vendor directory records when possible.
- Templates should not be treated as executed agreements until approved and signed.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(2)-(7)`
- `E-0020`
- `E-0021`
- `E-0024`
- `E-0025`
