# Full Building Evacuation Plan Algorithm

## Purpose
This support artifact defines the full building evacuation decision and action flow for {{facility_name}}. It is intended to become a readable digital workflow and printable flowchart, not a replica of the legacy Word flowchart.

## Artifact Use
The algorithm helps command staff understand the sequence of evacuation decisions, notifications, staffing actions, holding-area setup, resident movement, transportation coordination, and receiving placement. The workflow should link to the related evacuation procedures and forms rather than trying to contain every instruction in one diagram.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: workflow_algorithm
renderer_template: evacuation-algorithm-v1
render_intent:
  digital: clickable workflow with role filters and links to procedures
  print: simplified flowchart showing major decision points and handoffs
controls:
  - decision nodes
  - action nodes
  - role ownership
  - branch conditions
  - linked artifacts
start_node: evacuation_need_identified
nodes:
  - id: evacuation_need_identified
    type: trigger
    label: Incident may require partial or full building evacuation
    owner: Incident Commander
  - id: activate_command
    type: action
    label: Activate command center and assign command roles
    owner: Incident Commander
    links:
      - Activation of Plan
      - Activation of the Incident Command System
  - id: notify_partners
    type: action
    label: Notify emergency services, emergency management, public health or regulatory contacts, and receiving partners as applicable
    owner: Command Center
  - id: collect_status
    type: action
    label: Collect department status, census, staffing, equipment, route, and resident-care information
    owner: Planning Section Chief
    links:
      - Department Rapid Assessment Form
  - id: decide_evacuation_type
    type: decision
    label: Is evacuation emergent, urgent, or planned?
    owner: Incident Commander
    branches:
      - condition: immediate_life_safety_threat
        next: begin_protective_movement
      - condition: time_available_for_staging
        next: establish_labor_pool_and_holding
  - id: establish_labor_pool_and_holding
    type: action
    label: Establish labor pool, evacuation teams, holding areas, and transportation staging
    owner: Planning and Operations
    links:
      - Activate Labor Pool
      - Holding Areas
      - Transportation Internal / External
  - id: set_priority
    type: action
    label: Determine unit, area, and resident evacuation priority
    owner: Incident Commander
    links:
      - Evacuation Prioritization
  - id: prepare_residents
    type: action
    label: Prepare residents, records, medications, equipment, belongings, and identification
    owner: Resident-care leadership
    links:
      - Resident Preparation Guides
      - Resident Medical Records
      - Medications and Federally Controlled Substances
  - id: begin_protective_movement
    type: action
    label: Move residents through assigned routes to holding areas or discharge points
    owner: Operations Section Chief
    links:
      - Evacuation Order
      - Internal Routes of Travel
  - id: track_and_place
    type: action
    label: Track residents and coordinate destination, transportation, and responsible-party updates
    owner: Command Center and Holding Areas
    links:
      - Resident Evacuation Tracking Form
      - Receiving Facilities for Evacuation
      - Communications
  - id: close_or_transition
    type: end
    label: Continue movement until evacuation is complete, paused, or transitioned to recovery
    owner: Incident Commander
edges:
  - from: evacuation_need_identified
    to: activate_command
  - from: activate_command
    to: notify_partners
  - from: notify_partners
    to: collect_status
  - from: collect_status
    to: decide_evacuation_type
  - from: decide_evacuation_type
    to: establish_labor_pool_and_holding
  - from: establish_labor_pool_and_holding
    to: set_priority
  - from: set_priority
    to: prepare_residents
  - from: prepare_residents
    to: begin_protective_movement
  - from: begin_protective_movement
    to: track_and_place
  - from: track_and_place
    to: close_or_transition
review_questions:
  - Should this workflow show emergent and planned evacuation as separate visual branches?
  - Which related procedures should be direct links in the digital version?
  - Should the printable version fit on one page or allow a two-page command workflow?
```

## Maintenance
The algorithm should be reviewed with evacuation procedures, floor plans, route maps, receiving facility information, transportation resources, and job action sheets. Updates should follow drills, exercises, construction changes, or actual evacuation events.

## What Staff Should Understand
- The algorithm is a workflow map, not a substitute for procedure documents.
- The digital version should link to the operational documents and forms used at each step.
- The redesigned flowchart should be clearer than the legacy chart and may use different layout.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(2)-(7)`
- `§483.73(c)`
- `§483.73(c)(4)-(7)`
- `E-0020`
- `E-0021`
- `E-0024`
- `E-0025`
- `E-0029`
- `E-0033`
- `E-0034`
