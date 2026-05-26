# Resident Evacuation Tracking Form

## Purpose
This support artifact defines the resident evacuation tracking form for {{facility_name}}. The form tracks resident identity, care information, records, medications, equipment, transportation, holding-area movement, receiving-facility arrival, and family or provider notification during evacuation.

## Artifact Use
The form should support both printable emergency use and future digital entry. It should be clear enough for staff to complete quickly while preserving the information needed for resident safety, continuity of care, and location tracking.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: fixed_page_form
renderer_template: resident-evacuation-tracking-form-v1
render_intent:
  digital: field-group form with validation and repeatable status updates
  print: one- or two-page emergency form with grouped sections and large write-in areas
controls:
  - text inputs
  - date picker
  - time inputs
  - checkboxes
  - dropdowns
  - signature or initials fields
  - repeatable note blocks
  - print line areas
field_groups:
  - id: resident_identity
    label: Resident Identity
    fields:
      - id: resident_name
        control: text
        required: true
      - id: date_of_birth
        control: date
      - id: room_number
        control: text
      - id: medical_record_number
        control: text
      - id: care_category
        control: dropdown
        options: [independent_living, assisted_living, skilled_nursing, memory_care, other]
      - id: primary_physician
        control: text
  - id: clinical_summary
    label: Clinical Summary
    fields:
      - id: significant_diagnosis
        control: textarea
      - id: allergies
        control: textarea
      - id: isolation_or_precautions
        control: text
      - id: code_status
        control: dropdown
        options: [full_code, dnr, dni, other, unknown]
      - id: advance_directives
        control: checkbox_group
        options: [healthcare_proxy, living_will, molst_polst, other]
      - id: mental_status
        control: dropdown
        options: [alert, oriented, confused, lethargic, other]
      - id: mobility_or_transfer_needs
        control: dropdown
        options: [independent, supervision, partial_assist, total_assist, stretcher, other]
      - id: diet_or_special_needs
        control: textarea
  - id: items_sent
    label: Records, Medications, Belongings, and Equipment
    fields:
      - id: medical_record_status
        control: dropdown
        options: [with_resident, left_on_unit, sent_electronically, not_available]
      - id: medication_status
        control: dropdown
        options: [with_resident, left_on_unit, sent_with_nurse, not_applicable]
      - id: belongings_status
        control: dropdown
        options: [with_resident, secured_by_facility, with_responsible_party, none_listed]
      - id: equipment_sent
        control: repeatable_text
      - id: identification_confirmed
        control: checkbox
      - id: confirmed_by
        control: text
  - id: transport_and_holding
    label: Transport and Holding
    fields:
      - id: sent_to_holding_area
        control: yes_no
      - id: recommended_transport
        control: dropdown
        options: [als_ambulance, bls_ambulance, wheelchair_van, bus, facility_vehicle, family_vehicle, other]
      - id: time_arrived_holding
        control: time
      - id: holding_area_received_by
        control: text
      - id: time_departed_holding
        control: time
      - id: destination
        control: text
      - id: vehicle_identifier
        control: text
      - id: staff_accompanying
        control: text
  - id: notifications
    label: Notifications
    fields:
      - id: responsible_party_notified
        control: yes_no
      - id: responsible_party_contact_detail
        control: text
      - id: physician_notified
        control: yes_no
      - id: physician_contact_detail
        control: text
  - id: receiving_facility
    label: Receiving Facility Arrival
    fields:
      - id: time_arrived
        control: time
      - id: facility_name
        control: text
      - id: initial_care_location
        control: text
      - id: received_by
        control: text
      - id: receiving_facility_notes
        control: textarea
print_rules:
  - keep resident identity and transport fields visible on page one
  - use grouped sections instead of the legacy dense table layout
  - allow blank-line rendering when printed without digital values
review_questions:
  - Should this be one page for emergency speed or two pages for clinical completeness?
  - Which fields are mandatory before a resident leaves the unit?
  - Should receiving facilities complete a return section, or should that become a separate confirmation workflow?
```

## Maintenance
The form should be reviewed with the evacuation plan, medical record procedure, resident placement procedure, communications procedure, and receiving facility process. The facility should confirm that printed copies or digital access are available for the resident population.

## What Staff Should Understand
- The form tracks the resident, the destination, and the critical information that travels with the resident.
- Digital controls should make the form easier to complete, but the printable version must still work during power or system outages.
- The form should support responsible-party and provider updates without exposing information through unauthorized channels.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(2)-(7)`
- `§483.73(c)`
- `§483.73(c)(4)-(7)`
- `§483.73(c)(8)`
- `E-0020`
- `E-0021`
- `E-0024`
- `E-0025`
- `E-0029`
- `E-0033`
- `E-0034`
- `E-0035`
