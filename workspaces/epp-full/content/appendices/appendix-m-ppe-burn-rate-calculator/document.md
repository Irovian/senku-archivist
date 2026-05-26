# Appendix M - PPE Burn Rate Calculator

## Purpose
This appendix defines the PPE burn rate calculator for {{facility_name}}. It supports tracking PPE inventory, daily usage, resident demand assumptions, average consumption, and estimated days of supply remaining.

## Artifact Use
The calculator should become an interactive worksheet rather than a static spreadsheet replica. It should support daily data entry, calculated outputs, and a printable summary that leadership can use for resource planning, vendor coordination, and emergency reporting.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: calculator
renderer_template: ppe-burn-rate-calculator-v1
render_intent:
  digital: interactive calculator with daily inputs, formulas, warnings, and summary output
  print: calculation summary plus daily inventory table
controls:
  - numeric inputs
  - formula outputs
  - unit dropdowns
  - scenario rows
  - exported calculation summary
inputs:
  - id: reporting_period
    label: Reporting period
    control: date_range
  - id: resident_counts
    label: Resident counts
    repeatable_by_day: true
    fields:
      - suspected_residents
      - confirmed_residents
      - other_high_ppe_need_residents
  - id: ppe_items
    label: PPE items
    repeatable: true
    fields:
      - id: ppe_type
        control: dropdown_or_text
        starter_options: [washable_gowns, disposable_gowns, gloves_small, gloves_medium, gloves_large, gloves_extra_large, n95_masks, surgical_masks, respirators, face_shields, goggles, other]
      - id: units_per_box
        control: number
      - id: unit_label
        control: dropdown
        options: [each, pair, box, package, case]
      - id: starting_full_boxes
        control: number
      - id: daily_full_boxes_remaining
        control: number_series
      - id: manual_daily_units_used
        control: number_series_optional
calculations:
  - id: daily_units_used
    label: Daily units used
    formula: previous_day_units_remaining - current_day_units_remaining
  - id: average_daily_consumption
    label: Average daily consumption
    formula: average(valid_daily_units_used)
  - id: average_consumption_per_resident
    label: Average consumption per resident per day
    formula: average_daily_consumption / average_daily_resident_count
  - id: estimated_days_remaining
    label: Estimated days of supply remaining
    formula: current_units_remaining / average_daily_consumption
outputs:
  - burn_rate_by_ppe_type
  - days_supply_remaining_by_ppe_type
  - low_supply_warnings
  - printable_resource_summary
review_questions:
  - Which PPE categories should be locked as defaults versus customizable?
  - Should the calculator use full boxes only, individual units, or both?
  - What low-supply threshold should trigger warnings?
```

## Maintenance
The calculator should be reviewed when PPE categories, packaging units, emergency reporting expectations, or infection-control assumptions change. Staff using the calculator should confirm that units are consistent before relying on burn rate outputs.

## What Staff Should Understand
- The calculator needs consistent units to produce useful results.
- The digital version should reduce spreadsheet confusion by guiding daily entry and highlighting low-supply risks.
- The printable output should summarize key inputs, burn rate, and estimated days remaining.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(b)(1)`
- `E-0015`
