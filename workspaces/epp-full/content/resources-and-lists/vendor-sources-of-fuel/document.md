# Vendor Sources of Fuel

## Purpose
This support artifact defines the fuel vendor directory for {{facility_name}}. It turns legacy blank-list content into structured records that can be maintained digitally and rendered as a compact printable resource.

## Artifact Use
The directory should identify vendors or fueling locations that can support generator fuel, vehicle fuel, or other emergency fuel needs, including after-hours contact methods and agreement status.

The artifact should preserve the function and intent of the legacy Section F resource page while allowing records to be searched, filtered, updated, and exported cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: vendor_directory
renderer_template: fuel-vendor-directory-v1
render_intent:
  digital: fuel vendor records grouped by fuel type and delivery readiness
  print: compact fuel vendor list for command and maintenance use
controls:
  - fuel type dropdown
  - vendor records
  - phone inputs
  - 24/7 availability checkbox
  - agreement status dropdown
record_schema:
  id_prefix: fuel_vendor
  repeatable: true
  fields:
    - id: fuel_type
      label: Fuel type
      control: dropdown
      required: true
      options: [diesel, gasoline, propane, natural gas, other]
    - id: vendor_name
      label: Vendor name
      control: text
      required: true
    - id: vendor_location
      label: Vendor location
      control: textarea
    - id: primary_phone
      label: Primary phone
      control: tel
    - id: emergency_phone
      label: Emergency or 24/7 phone
      control: tel
    - id: delivery_available_24_7
      label: Delivery available 24/7
      control: checkbox
    - id: agreement_status
      label: Agreement status
      control: dropdown
      options: [agreement in place, informal source, needs confirmation, not applicable]
    - id: account_or_customer_number
      label: Account or customer number
      control: text
    - id: delivery_lead_time
      label: Delivery lead time
      control: text
    - id: maximum_delivery_or_capacity
      label: Maximum delivery or capacity
      control: text
    - id: notes
      label: Notes
      control: textarea
display_groups:
  - fuel type
  - agreement status
review_questions:
  - Should vendor account numbers be hidden in most exports?
  - Should this directory link directly to generator fuel-capacity fields?
  - Does the facility need vendors outside the immediate region for regional disasters?
```

## Maintenance
Verify fuel vendors annually, before high-risk seasons, after contract changes, and after any incident or drill that requires fuel coordination.

## What Staff Should Understand
- Fuel source records should show both routine and emergency contact methods.
- Agreement status matters when fuel demand is regional.
- Sensitive account details may need restricted export rules.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `§483.73(c)`
- `§483.73(c)(1)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `§483.73(e)(1)-(3)`
- `E-0015`
- `E-0029`
- `E-0030`
- `E-0031`
- `E-0032`
- `E-0041`
