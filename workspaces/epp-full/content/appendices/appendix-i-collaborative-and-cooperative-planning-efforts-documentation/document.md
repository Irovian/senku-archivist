# Appendix I - Collaborative and Cooperative Planning Efforts Documentation

## Purpose
This appendix defines the collaborative planning documentation log for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should document cooperation and collaboration with emergency preparedness officials, community partners, healthcare coalitions, agencies, and other planning partners.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: planning_log
renderer_template: collaborative-planning-log-v1
render_intent:
  digital: planning log with partner contacts, collaboration type, and evidence attachments
  print: collaborative planning evidence log for survey and annual review
controls:
  - agency fields
  - planning effort dropdown
  - date fields
  - contact fields
  - evidence attachments
  - follow-up status
record_schema:
  id_prefix: collaborative_planning_record
  repeatable: true
  fields:
    - id: planning_date
      label: Planning date
      control: date
      required: true
    - id: partner_organization
      label: Partner organization
      control: text
      required: true
    - id: contact_name
      label: Contact name
      control: text
    - id: contact_role
      label: Contact role
      control: text
    - id: planning_effort_type
      label: Planning effort type
      control: dropdown
      options: [meeting, exercise, phone call, email coordination, plan review, coalition activity, resource coordination, other]
    - id: topic_or_purpose
      label: Topic or purpose
      control: textarea
      required: true
    - id: outcome_or_decision
      label: Outcome or decision
      control: textarea
    - id: follow_up_needed
      label: Follow-up needed
      control: checkbox
    - id: follow_up_owner
      label: Follow-up owner
      control: text
    - id: evidence_attachment
      label: Evidence attachment
      control: file
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - planning effort type
  - partner organization
  - follow-up status
review_questions:
  - Which partner categories should be required for annual evidence?
  - Should email evidence be attachable from BrightSource later?
  - Should follow-up items feed the compliance calendar?
```

## Maintenance
Update the log whenever the facility participates in planning, coordination, exercises, meetings, or partner communication relevant to emergency preparedness.

## What Staff Should Understand
- Collaboration evidence should be captured as the work happens.
- The log should show both participation and follow-up decisions.
- Attachments can make annual review and survey preparation much easier.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(4)`
- `E-0009`
