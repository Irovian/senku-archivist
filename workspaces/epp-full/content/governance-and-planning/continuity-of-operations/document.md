# Continuity of Operations

## Purpose
This document explains how {{facility_name}} plans to sustain essential resident services, protect residents with different care needs, and continue operating when normal conditions are disrupted.

## Continuity Profile
Continuity planning at {{facility_name}} is based on the resident population served, the acuity mix present in the building, and the categories of care the facility may need to maintain during an emergency. The continuity profile should reflect the facility as it actually operates, including the services, resident characteristics, and support needs that could affect response decisions.

The facility operates as a {{facility_type_designation}} and currently supports the following service lines:
{{service_lines_offered_bullets}}

Continuity planning also considers resident mobility, medical complexity, cognitive status, behavioral health needs, communication barriers, cultural needs, language access, and other resident characteristics that may change how services are maintained during an emergency.

The facility uses this profile to help determine which services must be preserved on site, which services may require contingency arrangements, and when resident needs may exceed what can be safely supported in the building.

## Service Continuity Approach
When a disruption affects resident services, {{facility_name}} shifts to continuity measures designed to preserve care, stabilize essential operations, and support safe clinical decision-making until normal operations resume, alternate arrangements are activated, or residents are relocated.

The continuity strategy relies on preplanned response procedures, available staff, vendor and partner support, agreements with other healthcare organizations, transfer or receiving-site arrangements, and coordination with local or state emergency management when needed. Continuity decisions should account for resident safety, staff capacity, building conditions, utility status, supply availability, and the expected duration of the disruption.

<!-- assembly:ASM-CONTINUITY-MUTUAL-AID-PLAN-SUPPORT-CLAUSE start -->
When the facility participates in a mutual aid plan, those commitments may also be activated to supplement continuity operations.
<!-- assembly:ASM-CONTINUITY-MUTUAL-AID-PLAN-SUPPORT-CLAUSE end -->

<!-- assembly:ASM-CONTINUITY-HOME-HEALTHCARE-COMPONENT-CLAUSE start -->
When {{facility_name}} includes a Home Healthcare component, continuity planning and exercises should account for the separate emergency preparedness expectations that apply to that component.
<!-- assembly:ASM-CONTINUITY-HOME-HEALTHCARE-COMPONENT-CLAUSE end -->

If a needed service cannot be continued inside the building, the facility uses referral options, alternate care arrangements, or evacuation steps that match the resident's current needs. These decisions should be coordinated through the facility's emergency leadership structure and documented according to the related response procedures.

<!-- assembly:ASM-CONTINUITY-OUTPATIENT-REFERRAL-SUBSECTION start -->
### Outpatient Service Referral Arrangements
When a service that depends on outside providers or outpatient-style delivery cannot continue during the disruption, the facility uses the following continuity arrangements. Staff should coordinate these arrangements with the resident, responsible party, provider, and receiving service as appropriate for the situation.

<!-- assembly:ASM-CONTINUITY-THERAPY-REFERRAL-BULLET start -->
- Residents receiving respiratory, speech, occupational, or physical therapy services can be referred to {{therapy_referral_location}} for continuation of care.
<!-- assembly:ASM-CONTINUITY-THERAPY-REFERRAL-BULLET end -->
<!-- assembly:ASM-CONTINUITY-ADULT-DAY-CARE-REFERRAL-BULLET start -->
- Responsible parties for adult day care participants are notified of the service interruption and directed to {{adult_day_care_referral_location}} for longer-duration alternative arrangements.
<!-- assembly:ASM-CONTINUITY-ADULT-DAY-CARE-REFERRAL-BULLET end -->
<!-- assembly:ASM-CONTINUITY-HOME-CARE-REFERRAL-BULLET start -->
- Home care clients or responsible parties are informed when services cannot continue and are redirected to {{home_care_referral_destination}} for replacement services or an alternate location.
<!-- assembly:ASM-CONTINUITY-HOME-CARE-REFERRAL-BULLET end -->
<!-- assembly:ASM-CONTINUITY-OUTPATIENT-REFERRAL-SUBSECTION end -->

## Alternate Care and Relocation
If resident care needs can no longer be met safely on site, the facility moves to alternate placement or evacuation steps under the Full Building Evacuation Plan. This continuity document identifies the planning expectation; the evacuation plan, resident tracking tools, transportation procedures, and receiving-facility processes contain the operational details.

The facility maintains a temporary stop-over option at {{temporary_stopover_location}} and receiving-site relationships with {{receiving_facility_partners}}. These arrangements support decisions about short-term holding, transfer, evacuation, or continued care when the facility cannot maintain normal operations.

Alternate care sites identified by emergency management may also be used when conditions require them. If authorized through an 1135 waiver, the facility may help function as an alternate care location under the waiver terms. Detailed 1135 waiver responsibilities and alternate-care-site actions are handled in the related governance documents.

## Leadership Continuity
Continuity planning depends on delegations of authority and succession expectations so leadership and operational decisions can continue when the usual decision-makers are unavailable. The facility's incident command and order-of-succession documents identify the roles that assume authority, coordinate communication, approve response priorities, and direct service continuity decisions during an emergency.

Continuity decisions should be communicated to affected departments, documented as part of the response record, and revisited as conditions change. When normal operations resume, unresolved service gaps, resident impacts, and needed plan updates should be addressed through the facility's recovery and after-action processes.

## What Staff Should Understand
- Continuity planning starts with the actual resident population and care levels served by the facility.
- Service interruptions do not automatically mean care stops; they trigger continuity decisions, contingency arrangements, referrals, alternate placement, or evacuation steps.
- Outpatient, inpatient, alternate-care, and receiving-site arrangements should be coordinated with the related evacuation and incident command procedures.
- The Full Building Evacuation Plan owns the detailed movement, tracking, transportation, and transfer process when residents must leave the facility.
- Leadership coverage, delegations of authority, and continuity decisions must stay aligned with the broader emergency preparedness program.

## Customization Tokens
- `{{facility_name}}`
- `{{facility_type_designation}}`
- `{{service_lines_offered_bullets}}`
- `{{therapy_referral_location}}`
- `{{adult_day_care_referral_location}}`
- `{{home_care_referral_destination}}`
- `{{temporary_stopover_location}}`
- `{{receiving_facility_partners}}`

## Compliance References
- `§483.73(a)(3)`
- `E-0007`

## Working Notes
- Condition values for this document are set in `_project/customization_profiles/default.profile.json` and can be overridden per document if needed.
- `{{include_mutual_aid_plan_support_clause}}`: when `false`, export prep removes the optional mutual aid continuity paragraph.
- `{{include_home_healthcare_component_clause}}`: when `false`, export prep removes the Home Healthcare component planning reminder.
- `{{include_outpatient_services_referral_section}}`: when `false`, export prep removes the full outpatient referral subsection.
- `{{include_therapy_referral_bullet}}`: when `false`, export prep removes the therapy referral bullet.
- `{{include_adult_day_care_referral_bullet}}`: when `false`, export prep removes the adult day care referral bullet.
- `{{include_home_care_referral_bullet}}`: when `false`, export prep removes the Home Care referral bullet.
- Build `{{service_lines_offered_bullets}}` from the approved service-line taxonomy in the legacy source, retaining only the services actually offered by the facility:
  - Bariatric Care
  - Dementia/Alzheimer's Care
  - Ventilator Care
  - IV/Tube Feedings
  - Dialysis
  - Therapy (Respiratory, Speech, OT/PT)
  - Adult Day Care
  - Respite Care
  - Hospice Care
  - Rehabilitation
  - Home Care
  - Behavioral Health
