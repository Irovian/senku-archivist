# Emergency Utility Shut-Off Locations

## Purpose
This support artifact defines the utility shut-off location matrix for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The matrix should identify utility shut-off locations, the method for shutting off each utility, and who can access the shut-off point at any time.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: utility_matrix
renderer_template: utility-shutoff-matrix-v1
render_intent:
  digital: utility shut-off records with access roles, methods, and optional photos
  print: restricted utility shut-off matrix for command and responder use
controls:
  - utility dropdown
  - building/area fields
  - location fields
  - method text area
  - 24/7 access role
  - attachment field
record_schema:
  id_prefix: utility_shutoff
  repeatable: true
  fields:
    - id: utility_type
      label: Utility type
      control: dropdown
      required: true
      options: [domestic water, fire protection water, natural gas or propane, electric main feed, emergency generator, HVAC, refrigeration, other]
    - id: building_or_area
      label: Building or area
      control: text
    - id: shutoff_location
      label: Shut-off location
      control: textarea
      required: true
    - id: method_to_shut_off
      label: Method to shut off
      control: textarea
      required: true
    - id: access_role
      label: Who has 24/7 access
      control: text
      required: true
    - id: responder_notes
      label: Emergency responder notes
      control: textarea
    - id: photo_or_map_attachment
      label: Photo or map attachment
      control: file
    - id: last_verified
      label: Last verified
      control: date
    - id: restricted_information
      label: Restricted information
      control: checkbox
display_groups:
  - utility type
  - building or area
review_questions:
  - Should shut-off photos be required before approval?
  - Should detailed shut-off instructions be suppressed in public exports?
  - Which utilities need separate building-level records?
```

## Maintenance
Review utility shut-off records annually, after maintenance changes, after construction, and after drills or incidents involving utility isolation.

## What Staff Should Understand
- Utility shut-off information may be sensitive and should be controlled appropriately.
- Emergency responders may need accurate shut-off instructions when maintenance staff are not onsite.
- Utility records should be specific by building or area when systems differ.

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
