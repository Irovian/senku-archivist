# Internal Routes of Travel

## Purpose
This support artifact defines the internal evacuation travel routes used by {{facility_name}} during partial or full evacuation. It is intended to capture facility-specific route assignments, stairwell and elevator labels, holding-area destinations, discharge points, and route restrictions in a format that can be maintained digitally and rendered clearly for staff use.

## Artifact Use
The route matrix should help the Incident Commander, Operations Section Chief, evacuation team leaders, staff, and emergency responders identify which internal routes are available for resident movement, staff access, equipment movement, and emergency-services access.

Routes may change based on the incident, smoke or fire conditions, weather exposure, construction, blocked corridors, elevator availability, utility disruption, or instructions from emergency responders. The active route decision should be coordinated through the command center and communicated to evacuation teams, holding areas, and transportation staging.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: route_matrix
renderer_template: route-matrix-v1
render_intent:
  digital: route records with filters for floor, area, population, use, and current availability
  print: compact route matrix grouped by floor or care area with clear stairwell, elevator, holding-area, and pickup-point labels
controls:
  - floor or area dropdown
  - route use dropdown
  - stairwell label fields
  - elevator label fields
  - elevator-use status dropdown
  - holding-area destination field
  - discharge or pickup location field
  - map attachment reference
  - revision date
  - active or inactive route toggle
record_schema:
  id_prefix: internal_route
  repeatable: true
  fields:
    - id: floor_or_area
      label: Floor or area
      control: text
      required: true
    - id: population_or_unit
      label: Population or unit served
      control: text
    - id: route_name
      label: Route name or label
      control: text
      required: true
    - id: route_use
      label: Route use
      control: checkbox_group
      options: [resident_evacuation, staff_access, emergency_services_access, supply_or_equipment_movement, alternate_route, other]
    - id: primary_stairwell_label
      label: Primary stairwell
      control: text
    - id: alternate_stairwell_label
      label: Alternate stairwell
      control: text
    - id: elevator_label
      label: Elevator
      control: text
    - id: elevator_use_status
      label: Elevator use status
      control: dropdown
      options: [not_applicable, available_if_cleared, staff_only_if_cleared, emergency_services_only_if_cleared, unavailable]
    - id: holding_area_destination
      label: Holding area destination
      control: text
    - id: discharge_or_pickup_location
      label: Discharge or pickup location
      control: text
    - id: map_attachment_reference
      label: Floor plan or route map reference
      control: file_reference
    - id: route_restrictions
      label: Route restrictions or hazards
      control: textarea
    - id: communication_channel
      label: Communication channel for route updates
      control: text
    - id: last_verified_date
      label: Last verified
      control: date
    - id: active_route
      label: Active route
      control: checkbox
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - floor_or_area
  - route_use
  - active_route
print_rules:
  - group routes by floor or area
  - keep stairwell, elevator, holding-area, and pickup-point labels visible in print
  - show elevator status clearly so staff do not assume elevator use is allowed
review_questions:
  - Is the facility single-story, and if so should stairwell and elevator fields be hidden in the final renderer?
  - Which routes are for resident movement versus staff or emergency-services access?
  - Which route-map or floor-plan attachments should be linked to each route record once facility map assets are available?
```

## Maintenance
Route records should be reviewed at least annually, after evacuation exercises, after construction or renovation, after changes to unit layout or resident population, and after incidents that affect internal movement. The facility should verify route labels against posted signage, floor plans, holding-area plans, and pickup locations.

## What Staff Should Understand
- Internal routes may change during an incident; staff should follow the current command-center direction.
- Resident movement routes, staff access routes, and emergency-services access routes may not be the same.
- Elevators may be used only when they have been cleared for the situation and assigned purpose.
- Route records should connect to the facility's floor plans or route maps when those map assets are available.

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
