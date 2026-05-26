# Incident Command System Organizational Chart

## Purpose
This support artifact defines the Incident Command System role structure used by {{facility_name}} during emergency response. It preserves the function of the legacy organizational chart while preparing the chart for cleaner digital display, printable HTML/PDF output, and facility-specific role assignment.

## Artifact Use
The chart should help staff understand who leads the response, which roles may be activated, and how command, communication, operations, planning, logistics, finance, documentation, safety, liaison, and public information functions relate to each other.

The chart is not intended to show every possible person working in an emergency. It shows the command roles that may be activated and the relationships between them. The Incident Commander may scale the structure up or down based on the incident.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: org_chart
renderer_template: org-chart-v1
render_intent:
  digital: responsive role hierarchy with collapsible role details
  print: clean one-page chart with role boxes and assignment blanks
controls:
  - role nodes
  - assigned person fields
  - alternate fields
  - contact fields
  - node ordering
  - conditional role visibility
nodes:
  - id: incident_commander
    label: Incident Commander
    reports_to: null
    default_title: Administrator or designee
    role_summary: Directs the facility response and authorizes major protective actions.
    fields:
      - assigned_person
      - primary_title
      - alternate_person
      - telephone
      - radio_title
  - id: documentation_recorder
    label: Documentation Recorder
    reports_to: incident_commander
    role_summary: Captures incident information, decisions, logs, and response records.
    fields:
      - assigned_person
      - alternate_person
      - telephone
  - id: safety_security_liaison_officer
    label: Safety / Security / Liaison Officer
    reports_to: incident_commander
    role_summary: Coordinates safety, security, traffic, liaison, and outside-agency contact functions.
    fields:
      - assigned_person
      - alternate_person
      - telephone
      - radio_title
  - id: public_information_officer
    label: Public Information Officer
    reports_to: incident_commander
    role_summary: Coordinates approved messages for families, representatives, media, and public-facing channels.
    fields:
      - assigned_person
      - alternate_person
      - telephone
  - id: operations_section_chief
    label: Operations Section Chief
    reports_to: incident_commander
    role_summary: Oversees clinical operations, resident care actions, evacuation movement, triage, and holding areas.
    fields:
      - assigned_person
      - alternate_person
      - telephone
  - id: planning_section_chief
    label: Planning Section Chief
    reports_to: incident_commander
    role_summary: Collects situation information, staffing information, projections, and action planning support.
    fields:
      - assigned_person
      - alternate_person
      - telephone
  - id: logistics_section_chief
    label: Logistics Section Chief
    reports_to: incident_commander
    role_summary: Coordinates facility systems, supplies, food, water, transportation resources, and equipment support.
    fields:
      - assigned_person
      - alternate_person
      - telephone
  - id: finance_section_chief
    label: Finance Section Chief
    reports_to: incident_commander
    role_summary: Tracks incident costs, purchasing, contracts, procurement records, and financial documentation.
    fields:
      - assigned_person
      - alternate_person
      - telephone
optional_child_roles:
  - id: labor_pool_unit_leader
    parent: planning_section_chief
  - id: triage_unit_leader
    parent: operations_section_chief
  - id: holding_area_unit_leader
    parent: operations_section_chief
  - id: evacuation_team_leaders
    parent: labor_pool_unit_leader
review_questions:
  - Should role titles be customized by facility position, or should they remain generic ICS roles?
  - Which roles should appear on the one-page print view by default?
```

## Maintenance
The facility should review role titles, assigned positions, alternates, and contact fields during annual emergency preparedness review, after exercises, and after incidents that reveal command structure gaps.

## What Staff Should Understand
- The Incident Commander leads the response and activates other roles as needed.
- The chart shows reporting relationships, not staffing levels.
- Role assignments may be customized by facility position.
- The printable version should be readable and should not preserve the crowded legacy layout.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(3)`
- `§483.73(c)`
- `§483.73(c)(3)`
- `§483.73(d)`
- `E-0007`
- `E-0029`
- `E-0032`
- `E-0036`
