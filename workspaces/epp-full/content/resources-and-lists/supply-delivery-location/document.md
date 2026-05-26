# Supply Delivery Location

## Purpose
This support artifact defines the supply delivery location record for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The record should help staff and vendors identify where emergency supplies should be delivered, whether unloading support is needed, and what route or access notes matter during an incident.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: site_access_record
renderer_template: supply-delivery-location-v1
render_intent:
  digital: site-access record with delivery instructions and map/photo attachments
  print: one-page delivery access card for vendors and command staff
controls:
  - location fields
  - latitude/longitude fields
  - yes/no dropdowns
  - access notes
  - attachment field
record_schema:
  id_prefix: supply_delivery_location
  repeatable: true
  fields:
    - id: location_type
      label: Delivery location type
      control: dropdown
      required: true
      options: [loading dock, rear entrance, main entrance, service entrance, other]
    - id: location_description
      label: Location description
      control: textarea
      required: true
    - id: receiving_hours_or_conditions
      label: Receiving hours or conditions
      control: text
    - id: liftgate_or_ramp_required
      label: Liftgate or ramp required
      control: dropdown
      options: [yes, no, unknown]
    - id: latitude
      label: Latitude
      control: number
    - id: longitude
      label: Longitude
      control: number
    - id: vehicle_approach_notes
      label: Vehicle approach notes
      control: textarea
    - id: security_or_access_notes
      label: Security or access notes
      control: textarea
    - id: onsite_contact_role
      label: Onsite contact role
      control: text
    - id: attachment
      label: Map or photo attachment
      control: file
review_questions:
  - Should multiple delivery locations be allowed for different supply types?
  - Should the digital version require a map/photo attachment?
  - Who should update this record after construction or loading-area changes?
```

## Maintenance
Review the delivery location after construction, access changes, drills, supply vendor changes, and annual emergency preparedness review.

## What Staff Should Understand
- Emergency deliveries may arrive when normal receiving staff are unavailable.
- Access details should be specific enough for outside vendors or responders.
- Map and photo attachments can reduce confusion during high-pressure deliveries.

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
