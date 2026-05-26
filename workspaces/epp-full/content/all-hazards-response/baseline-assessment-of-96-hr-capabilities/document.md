# Baseline Assessment of 96 Hr. Capabilities

## Purpose
This document explains how {{facility_name}} maintains a baseline assessment of its ability to sustain critical supplies and essential support systems during an all-hazards emergency.

## Assessment Role
The baseline assessment provides a planning snapshot. It does not replace the immediate assessment required during an actual emergency, when census, staffing, deliveries, utilities, weather, building conditions, vendor access, and resident needs may be different from the baseline assumption.

The standard planning duration is 96 hours unless the facility approves a different duration. If a different duration applies, document it here: {{different_than_hours}}. Food, water, medical supplies, and pharmaceuticals should be assessed against the approved duration for those categories: {{different_than_hours_food_water_medical}}.

## Assessment Assumptions
The assessment should be based on a realistic operating point, such as average census and expected minimum supply levels immediately before routine delivery. It should consider critical supplies first, while recognizing that actual emergency evaluation should look at all supplies, services, and resident care needs.

Unless noted otherwise, the baseline assessment assumes normal utility service. If utilities are disrupted, staff should use the related utility-loss and conservation procedures in addition to this assessment.

Staffing is not measured as a stored supply, but it remains a critical capability. During an emergency, leadership should evaluate whether staffing levels, staff availability, and role coverage can support the planned duration.

## Capability Assessment Table
The facility should maintain a working capability table that identifies the minimum supply available without outside resources, the expected duration with conservation or contingency measures, and the planned conservation action. Examples should be reviewed and adjusted to reflect actual facility capabilities: {{examples_only_reflect_capabilities_this_column}}.

| Capability Area | Minimum Available Without Outside Resources | Expected Duration With Conservation or Contingency Measures | Conservation or Contingency Measure |
| --- | --- | --- | --- |
| Domestic water and potable water | {{indicate_number_days_unlimited_supply_this}} | {{indicate_number_days_unlimited_supply_this}} | Identify stored water, alternate liquids, vendors, delivery assumptions, and conservation steps. |
| Food and nutrition supplies | {{indicate_number_days_unlimited_supply_this}} | {{indicate_number_days_unlimited_supply_this}} | Identify emergency menus, substitutions, storage limits, and vendor support. |
| Medical supplies and pharmaceuticals | {{indicate_number_days_unlimited_supply_this}} | {{indicate_number_days_unlimited_supply_this}} | Identify par levels, backup supply options, pharmacy support, and priority use decisions. |
| Heating, hot water, and fuel systems | {{reflect_proper_system_place}} | {{reflect_proper_system_place}} | Identify the system in place, fuel source, conservation steps, vendor support, and loss-of-utility actions. |
| Emergency lighting, fire protection, sewage, and waste disposal | {{reflect_proper_system_place}} | {{reflect_proper_system_place}} | Identify backup systems, manual procedures, vendor support, and escalation triggers. |
<!-- assembly:ASM-BASELINE-OXYGEN-PRIMARY-ROW start -->
| Oxygen - primary conditions | {{indicate_number_days_unlimited_supply_this}} | {{indicate_number_days_unlimited_supply_this}} | Keep this row only when oxygen supply planning applies to the facility; otherwise apply {{row_not_applicable}}. |
<!-- assembly:ASM-BASELINE-OXYGEN-PRIMARY-ROW end -->
<!-- assembly:ASM-BASELINE-OXYGEN-LOSS-PRIMARY-ROW start -->
| Oxygen - loss of primary conditions | {{indicate_number_days_unlimited_supply_this}} | {{indicate_number_days_unlimited_supply_this}} | Keep this row only when backup oxygen planning applies to the facility; otherwise apply {{row_not_applicable}}. |
<!-- assembly:ASM-BASELINE-OXYGEN-LOSS-PRIMARY-ROW end -->

## Using the Assessment During an Emergency
During an emergency, leadership should compare the baseline assessment to actual conditions. The current evaluation should account for resident census, resident acuity, available staff, open deliveries, damaged or unavailable systems, vendor access, weather, road conditions, conservation options, and the expected time before outside support is available.

If actual capability is lower than the baseline assumption, leadership should consider conservation, alternate processes, urgent vendor coordination, resource requests, transfer planning, evacuation planning, or other protective actions.

## Coordination With Related Documents
This topic should be read with:

- Loss of Utilities and utility-specific response procedures, which contain conservation and contingency actions during utility disruption.
- Shelter in Place Plan and Continuity of Operations, which explain how resource status affects the ability to remain safely in place.
- Disaster Staffing, which addresses staffing capability during response.
- Emergency supply, vendor, generator, water, food, medical supply, pharmaceutical, and oxygen resources, which maintain detailed inventories and contacts.
- Evacuation and transfer documents, which apply when capability is no longer sufficient to protect residents in place.

## What Staff Should Understand
- The baseline assessment is a planning tool, not a substitute for real-time emergency assessment.
- The standard planning assumption is 96 hours unless the facility approves a different duration.
- Food, water, medical supplies, pharmaceuticals, utilities, emergency lighting, fire systems, sewage, and waste disposal must be considered.
- Conservation and contingency measures should be realistic and based on the facility's actual systems.
- If actual conditions fall below baseline capability, leadership should escalate resource, shelter-in-place, transfer, or evacuation decisions.

## Customization Tokens
- `{{facility_name}}`
- `{{different_than_hours}}`
- `{{different_than_hours_food_water_medical}}`
- `{{examples_only_reflect_capabilities_this_column}}`
- `{{indicate_number_days_unlimited_supply_this}}`
- `{{reflect_proper_system_place}}`
- `{{row_not_applicable}}`

## Compliance References
- `§483.73(b)`
- `§483.73(b)(1)`
- `E-0013`
- `E-0015`

## Working Notes
- The oxygen rows are preserved by default during draft review.
- `{{row_not_applicable}}`: when `true`, export prep removes the oxygen planning rows controlled by this assembly rule.
