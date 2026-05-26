# Receiving Facilities for Evacuation

## Purpose
This support artifact defines the receiving-facility directory used by {{facility_name}} during evacuation planning and resident placement. It preserves the function of the legacy receiving-facility pages while turning the information into repeatable, searchable records that can support digital lookup and clean print/PDF export.

## Artifact Use
The directory should help the command center, resident placement staff, transportation coordinators, and resident-care leaders identify potential receiving locations, confirm contact methods, understand agreement status, and estimate available capacity during partial or full evacuation.

The directory should include nearby options and regional backup options so the facility is not dependent on one destination or one geographic area. No receiving facility should be treated as available during an incident until current capacity, transportation feasibility, population fit, and contact information are confirmed.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: receiving_facility_directory
renderer_template: receiving-facility-directory-v1
render_intent:
  digital: searchable receiving-facility records with capacity, contact, agreement, distance, and population-fit filters
  print: compact directory pages grouped by distance category, facility type, and agreement status
controls:
  - repeatable facility records
  - text inputs
  - address fields
  - phone inputs
  - email inputs
  - facility type dropdown
  - agreement status dropdown
  - capacity number fields
  - distance category dropdown
  - population-fit checkboxes
  - active or inactive toggle
record_schema:
  id_prefix: receiving_facility
  repeatable: true
  fields:
    - id: evacuation_destination_label
      label: Evacuation destination label
      control: text
    - id: receiving_facility_name
      label: Receiving facility name
      control: text
      required: true
    - id: street_address
      label: Street address
      control: text
    - id: city
      label: City
      control: text
    - id: state
      label: State
      control: text
    - id: zip_code
      label: ZIP code
      control: text
    - id: main_phone
      label: Main phone
      control: tel
    - id: fax
      label: Fax
      control: tel
    - id: general_email
      label: General email
      control: email
    - id: primary_contact_name
      label: Primary contact name
      control: text
    - id: primary_contact_title
      label: Primary contact title
      control: text
    - id: primary_contact_phone
      label: Primary contact phone
      control: tel
    - id: primary_contact_mobile
      label: Primary contact mobile
      control: tel
    - id: primary_contact_email
      label: Primary contact email
      control: email
    - id: secondary_contact_name
      label: Secondary contact name
      control: text
    - id: secondary_contact_title
      label: Secondary contact title
      control: text
    - id: secondary_contact_phone
      label: Secondary contact phone
      control: tel
    - id: secondary_contact_mobile
      label: Secondary contact mobile
      control: tel
    - id: secondary_contact_email
      label: Secondary contact email
      control: email
    - id: facility_type
      label: Facility type
      control: checkbox_group
      options: [independent_living, assisted_living, nursing_home, skilled_nursing, hospital, shelter, stop_over_location, other]
    - id: facility_use
      label: Planned use
      control: checkbox_group
      options: [receiving_facility, temporary_stop_over, specialty_placement, family_pickup_support, transportation_staging, other]
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [mou_or_moa_in_place, mutual_aid_partner, contract_in_place, verbal_relationship_only, needs_confirmation, not_applicable]
    - id: licensed_bed_capacity
      label: Licensed bed capacity
      control: number
    - id: estimated_surge_capacity
      label: Estimated surge capacity
      control: number
    - id: distance_category
      label: Distance category
      control: dropdown
      options: [nearby_primary_option, closest_ten_candidate, regional_backup, fifty_miles_or_farther, other]
    - id: estimated_distance_miles
      label: Estimated distance in miles
      control: number
    - id: population_fit
      label: Population fit
      control: checkbox_group
      options: [independent_living, assisted_living, skilled_nursing, memory_care, oxygen_or_clinical_support, bariatric_support, other]
    - id: transportation_notes
      label: Transportation notes
      control: textarea
    - id: last_confirmed_date
      label: Last confirmed
      control: date
    - id: confirmation_contacted_by
      label: Confirmed by
      control: text
    - id: active_record
      label: Active receiving option
      control: checkbox
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - distance_category
  - facility_type
  - agreement_status
  - active_record
print_rules:
  - keep facility name, type, distance category, agreement status, capacity, and primary contact visible in compact print view
  - allow expanded contact pages when full contact detail is needed
  - do not invent facility names or capacity values in exported blank templates
review_questions:
  - Should the final directory require a baseline set of nearby receiving options plus at least one regional-distance backup option?
  - Which facility types should be included for the populations served by {{facility_name}}?
  - Should agreement status distinguish formal MOU/MOA, contract, mutual aid, and informal relationship in the final renderer?
```

## Maintenance
Receiving-facility records should be reviewed at least annually, after exercises, after known partner changes, and during any incident where evacuation may be needed. Contact names, phone numbers, email addresses, agreement status, distance, population fit, and capacity assumptions should be verified before relying on a destination.

## What Staff Should Understand
- The directory is a planning and coordination tool; real-time availability must still be confirmed during the incident.
- Nearby receiving options and farther regional options both matter when local conditions affect multiple facilities.
- Agreement status, population fit, and transportation feasibility are as important as bed count.
- The directory should remain structured so it can be searched, filtered, updated, and printed quickly.

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
