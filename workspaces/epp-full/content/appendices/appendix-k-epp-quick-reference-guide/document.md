# Appendix K - EPP Quick Reference Guide

## Purpose
This appendix defines the Emergency Preparedness Program quick reference guide for {{facility_name}}. The guide is intended to give staff fast, practical emergency actions in a format that works as a digital quick guide and as a printable reference sheet.

## Artifact Use
The quick reference guide should be redesigned for clarity. The function is to help staff identify a hazard or emergency condition, see immediate actions, and know who to notify or where to look next. The legacy 11x17 design does not need to be preserved.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: quick_reference
renderer_template: quick-reference-guide-v1
render_intent:
  digital: searchable hazard cards with quick actions and links to procedures
  print: high-contrast quick reference sheet, likely wide format
controls:
  - hazard/action records
  - icon/category fields
  - priority labels
  - wide-format layout metadata
record_schema:
  id_prefix: quick_ref
  repeatable: true
  fields:
    - id: hazard_or_event
      label: Hazard or event
      control: text
      required: true
    - id: category
      label: Category
      control: dropdown
      options: [fire_life_safety, medical, security, utility, weather, evacuation, communication, missing_resident, other]
    - id: icon
      label: Icon
      control: icon_picker
    - id: immediate_actions
      label: Immediate actions
      control: repeatable_checklist
    - id: notifications
      label: Notifications
      control: repeatable_text
    - id: related_procedure
      label: Related procedure
      control: document_link
    - id: staff_notes
      label: Staff notes
      control: textarea
display_rules:
  - show immediate actions first
  - keep each hazard card short enough for scanning
  - use icons as visual anchors, not decoration
  - support wide print output and mobile stacked view
starter_categories:
  - General Emergency
  - Loss of Service
  - Fire or Code Red
  - Bomb Threat or Suspicious Package
  - Earthquake or Structural Event
  - Security Situation
  - Active Shooter or Weapon
  - Missing Resident
review_questions:
  - Which hazards should be included in the first facility-ready quick guide?
  - Should residents/families see any version of this guide, or is it staff-only?
  - Should the print target remain 11x17 or move to letter-size pages?
```

## Maintenance
The quick reference guide should be reviewed after hazard-specific procedures are approved, after drills, and after incidents. Any quick action listed here must stay aligned with the full procedure it points to.

## What Staff Should Understand
- The quick guide is a fast prompt, not the full emergency plan.
- The digital version should link to the complete procedure for each hazard.
- The print version should be readable at a glance and should not preserve the crowded legacy design.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(c)(8)`
- `E-0035`
