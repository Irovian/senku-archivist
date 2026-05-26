# Appendix G - Resident and Responsible Party Emergency Communications Plan

## Purpose
This appendix defines the resident and representative emergency communication guide for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should identify how emergency plan information and incident updates are shared with residents, representatives, families, and other responsible parties. It should support preplanned messages, approved channels, and delivery documentation.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: communications_guide
renderer_template: resident-party-communications-guide-v1
render_intent:
  digital: message and channel records for resident and representative communication
  print: staff reference and handout-ready communication plan
controls:
  - audience dropdowns
  - channel selectors
  - message templates
  - approval status
  - delivery tracking fields
record_schema:
  id_prefix: resident_party_message
  repeatable: true
  fields:
    - id: audience
      label: Audience
      control: dropdown
      required: true
      options: [residents, responsible parties, families, physicians, staff answering calls, other]
    - id: message_type
      label: Message type
      control: dropdown
      options: [preparedness information, incident update, evacuation update, reunification or destination update, all clear, other]
    - id: communication_channel
      label: Communication channel
      control: multi_select
      options: [phone, text, email, website, recorded line, letter, in-person meeting, social media, other]
    - id: message_template
      label: Message template
      control: textarea
    - id: approval_required_by
      label: Approval required by
      control: text
    - id: delivery_owner
      label: Delivery owner
      control: text
    - id: documentation_method
      label: Documentation method
      control: text
    - id: primary_emergency_contact
      label: Primary emergency contact
      control: text
    - id: ombudsman_contact_reference
      label: Ombudsman contact reference
      control: text
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - audience
  - message type
  - channel
review_questions:
  - Which communication channels should be default for each audience?
  - Should this guide include resident-facing handout language?
  - Who approves messages before release during evacuation?
```

## Maintenance
Review the communication guide annually, after contact-list changes, after exercises, and after incidents where resident or representative communication needs improvement.

## What Staff Should Understand
- Residents and representatives need clear, approved information before and during emergencies.
- Message release should stay coordinated with command and the communications plan.
- Delivery documentation helps show that required information was shared.

## Customization Tokens
- `{{facility_name}}`
- `{{state_ltc_ombudsman_contact}}`
- `{{primary_emergency_contact_name}}`

## Compliance References
- `§483.73(c)(8)`
- `E-0035`
