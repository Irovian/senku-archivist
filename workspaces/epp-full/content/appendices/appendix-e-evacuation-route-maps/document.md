# Appendix E - Evacuation Route Maps

## Purpose
This appendix defines the evacuation route map attachment register for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should control evacuation map attachments and route metadata for each floor, building, unit, or area. It should not try to force the map drawing itself into Markdown.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: map_attachment
renderer_template: evacuation-route-map-attachment-v1
render_intent:
  digital: map register with attached route maps, floor filters, and route metadata
  print: map cover page plus one map per selected floor or area
controls:
  - file attachments
  - floor selector
  - area fields
  - route labels
  - revision fields
  - accessibility notes
record_schema:
  id_prefix: evacuation_route_map
  repeatable: true
  fields:
    - id: map_title
      label: Map title
      control: text
      required: true
    - id: building_or_area
      label: Building or area
      control: text
    - id: floor_or_level
      label: Floor or level
      control: text
    - id: route_type
      label: Route type
      control: dropdown
      options: [primary evacuation route, alternate evacuation route, horizontal relocation route, stairwell route, discharge route, other]
    - id: map_attachment
      label: Map attachment
      control: file
      required: true
    - id: route_labels
      label: Route labels
      control: repeatable_text
    - id: stair_or_elevator_notes
      label: Stair or elevator notes
      control: textarea
    - id: accessibility_or_equipment_notes
      label: Accessibility or equipment notes
      control: textarea
    - id: revision_date
      label: Revision date
      control: date
    - id: approved_by
      label: Approved by
      control: text
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - building or area
  - floor or level
  - route type
review_questions:
  - Should map attachments be required before this appendix can be marked complete?
  - Should route maps also appear in the evacuation floor plan artifact?
  - Who approves map revisions after construction or route changes?
```

## Maintenance
Review maps annually, after construction or renovation, after evacuation drills, and whenever routes, exits, holding areas, or discharge points change.

## What Staff Should Understand
- Maps should live as attachments with metadata, not as Markdown tables.
- Route labels should align with evacuation policies and floor plan artifacts.
- Map revisions need ownership and approval.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(2)-(7)`
- `E-0020`
- `E-0021`
- `E-0024`
- `E-0025`
