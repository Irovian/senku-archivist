# Transportation Resources - Facility Owned Vehicles

## Purpose
This support artifact defines the facility-owned vehicle roster for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The roster should identify facility-owned vehicles that may support resident transportation, staff movement, supply movement, or equipment movement during emergency operations.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: vehicle_roster
renderer_template: vehicle-roster-v1
render_intent:
  digital: vehicle roster with capacity, fuel, assignment, and readiness fields
  print: compact vehicle roster for transportation planning
controls:
  - vehicle records
  - vehicle type dropdown
  - fuel type dropdown
  - seat fields
  - wheelchair capacity fields
  - maintenance status
record_schema:
  id_prefix: facility_vehicle
  repeatable: true
  fields:
    - id: vehicle_id
      label: Vehicle ID or label
      control: text
      required: true
    - id: year
      label: Year
      control: number
    - id: make
      label: Make
      control: text
    - id: model
      label: Model
      control: text
    - id: vehicle_type
      label: Vehicle type
      control: dropdown
      options: [van, bus, truck, car, other]
    - id: fuel_type
      label: Fuel type
      control: dropdown
      options: [gasoline, diesel, propane, electric, hybrid, other]
    - id: registration_number
      label: Registration number
      control: text
    - id: assigned_department
      label: Department assigned to
      control: text
    - id: transportation_use
      label: Transportation use
      control: dropdown
      options: [residents, equipment and supplies, staff, mixed use]
    - id: seat_count
      label: Seat count
      control: number
    - id: wheelchair_positions
      label: Wheelchair positions
      control: number
    - id: load_capacity
      label: Load capacity
      control: text
    - id: key_location
      label: Key location
      control: text
    - id: readiness_status
      label: Readiness status
      control: dropdown
      options: [ready, needs fuel, needs maintenance, out of service]
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - vehicle type
  - transportation use
  - readiness status
review_questions:
  - Should vehicle key location be restricted in exports?
  - Should inspection, insurance, and driver requirements be added as future fields?
  - Should resident-transport capacity calculate totals automatically?
```

## Maintenance
Review the vehicle roster annually, after vehicle purchase or removal, after maintenance status changes, and before evacuation season or transportation drills.

## What Staff Should Understand
- Vehicle records should show what each vehicle can safely transport.
- Readiness matters as much as ownership.
- Transportation capacity should be easy to calculate during evacuation planning.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `§483.73(c)`
- `§483.73(c)(1)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `E-0015`
- `E-0029`
- `E-0030`
- `E-0031`
- `E-0032`
