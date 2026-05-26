# Command Center Organizational Chart

## Purpose
This support artifact defines the command-center operating structure used by {{facility_name}} when the Incident Command System is activated. It preserves the intent of the legacy command-center chart while making role ownership, functional areas, and facility-specific assignments easier to maintain and render.

## Artifact Use
The chart should help command staff see which functions are active, who is responsible for each function, and how command-center work connects to resident care, logistics, planning, finance, safety, liaison, public information, and documentation.

The chart is not a staffing roster. It is a functional map that can be scaled by the Incident Commander based on incident size, duration, and complexity.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: org_chart
renderer_template: command-center-org-chart-v1
render_intent:
  digital: role hierarchy with functional responsibility panels and assignment fields
  print: one-page command-center chart with role boxes, assigned-person blanks, and primary/alternate command-center locations
command_center:
  primary_location: {{primary_command_center_location}}
  alternate_location: {{alternate_command_center_location}}
  facility: {{facility_name}}
controls:
  - role nodes
  - assigned person fields
  - alternate fields
  - contact fields
  - functional responsibility tags
  - conditional role visibility
nodes:
  - id: incident_commander
    label: Incident Commander
    default_title: Administrator or designee
    reports_to: null
    functions:
      - directs response and maintains building operations
      - authorizes major protective actions
      - authorizes building evacuation decision
  - id: documentation_recorder
    label: Documentation Recorder
    default_title: Administrative Assistant or Executive Assistant
    reports_to: incident_commander
    functions:
      - command center setup
      - incident information record
      - response documentation
      - custodian of documents
  - id: safety_security_liaison_officer
    label: Safety / Security / Liaison Officer
    default_title: facility-designated safety or security lead
    reports_to: incident_commander
    functions:
      - building security
      - traffic flow and parking
      - rescue and hazardous-materials liaison
      - healthcare facility liaison
      - emergency agency liaison
  - id: public_information_officer
    label: Public Information Officer
    default_title: Director of Marketing or designee
    reports_to: incident_commander
    functions:
      - news media
      - resident families and responsible parties
      - approved public-facing messages
  - id: logistics_section_chief
    label: Logistics Section Chief
    default_title: Director of Maintenance or designee
    reports_to: incident_commander
    functions:
      - physical building
      - maintenance
      - toilet and waste support
      - communication support
      - transportation support
      - food and supplies
      - information systems equipment
  - id: planning_section_chief
    label: Planning Section Chief
    default_title: Human Resources Director or designee
    reports_to: incident_commander
    functions:
      - intelligence gathering
      - overall operations plan support
      - staff collection and tracking
      - staff services
      - situation projections
  - id: operations_section_chief
    label: Operations Section Chief
    default_title: Director of Nursing or designee
    reports_to: incident_commander
    functions:
      - clinical services
      - resident care operations
      - triage and holding areas
      - evacuation movement support
  - id: finance_section_chief
    label: Finance Section Chief
    default_title: CFO, accountant, or business office designee
    reports_to: incident_commander
    functions:
      - funds and procurement documentation
      - cost tracking
      - time and contract records
review_questions:
  - Are default position titles accurate for this facility?
  - Which roles should appear on the one-page command-center print view by default?
  - Should primary and alternate command-center phone numbers be separate structured fields?
```

## Maintenance
The facility should review this chart annually, after exercises, and after incidents. Review should confirm role titles, alternates, command-center locations, contact methods, and whether the command-center chart should include or hide optional roles for the facility.

## What Staff Should Understand
- The command-center chart organizes response functions, not every staff assignment.
- The Incident Commander activates only the roles needed for the incident.
- Default titles may be customized by facility position as long as the command function remains clear.
- The printable version should be readable and should not preserve the crowded legacy chart layout.

## Customization Tokens
- `{{collaborative_partners}}`
- `{{alternate_command_center_location}}`
- `{{primary_command_center_location}}`
- `{{facility_name}}`
- `{{local_response_agencies}}`
- `{{plan_owner_title}}`

## Compliance References
- `§483.73(a)(3)`
- `§483.73(c)`
- `§483.73(c)(3)`
- `§483.73(d)`
- `E-0007`
- `E-0029`
- `E-0032`
- `E-0036`
