# External Communications During a Disaster

## Purpose
This document explains how {{facility_name}} communicates with outside agencies, partners, public-information channels, and other external audiences during a disaster.

## External Communication Priorities
External communication should support emergency coordination, regulatory or agency reporting, resident continuity of care, resource requests, public information, and communication with organizations that may assist the facility during response.

The Incident Commander or designee should determine which external contacts must be notified, which communication channels are available, who is authorized to release information, and how communications should be documented.

## External Audiences
Depending on the emergency, external communication may include emergency management, fire, police, EMS, public health, licensing or certification agencies, the state long-term care ombudsman, hospitals, receiving facilities, sister or system facilities, vendors, transportation providers, utility providers, resident representatives, media contacts, and other response partners.

The facility's primary emergency contact is {{primary_emergency_contact_name}}. State long-term care ombudsman contact information is maintained as {{state_ltc_ombudsman_contact}}.

<!-- assembly:ASM-EXTERNAL-SISTER-SYSTEM-FACILITIES start -->
Sister, system, or corporate facilities may be contacted through {{sister_system_facility_communications}} when those facilities remain operational and relevant to the response.
<!-- assembly:ASM-EXTERNAL-SISTER-SYSTEM-FACILITIES end -->

## External Communication Methods
The facility should use the communication methods that remain functional during the particular disaster. Available methods may include telephone, email, web-based reporting, health alert systems, radios, satellite phones, emergency management relays, public information channels, websites, hotlines, or other approved communication methods.

The external health alert or reporting system used by the facility is {{external_health_alert_system_name}}.

<!-- assembly:ASM-EXTERNAL-RADIO-SYSTEM start -->
Local, regional, or state radio system communication is maintained at {{external_radio_system_location}} when applicable.
<!-- assembly:ASM-EXTERNAL-RADIO-SYSTEM end -->

<!-- assembly:ASM-EXTERNAL-SATELLITE-PHONE start -->
Satellite phone communication is available at {{satellite_phone_location}} when applicable and may be used when normal communication methods are unavailable.
<!-- assembly:ASM-EXTERNAL-SATELLITE-PHONE end -->

<!-- assembly:ASM-EXTERNAL-ARES-CERT start -->
Amateur radio, ARES, CERT, or similar emergency communication support may be requested through {{ares_cert_contact_process}} when applicable.
<!-- assembly:ASM-EXTERNAL-ARES-CERT end -->

## Public Information Channels
External public information should be coordinated through the Incident Commander, Public Information Officer, or another assigned leader. Messages should be accurate, approved, privacy-aware, and consistent across channels.

<!-- assembly:ASM-EXTERNAL-FACILITY-WEBSITE start -->
The facility website, {{facility_website}}, may be used for public or family-facing emergency updates. {{communication_update_owner_title}} is authorized to coordinate real-time website updates when assigned.
<!-- assembly:ASM-EXTERNAL-FACILITY-WEBSITE end -->

<!-- assembly:ASM-EXTERNAL-COMMUNITY-HOTLINE start -->
A community hotline may be activated at {{community_hotline_phone_number}} to provide recorded or scripted public information and instructions when applicable.
<!-- assembly:ASM-EXTERNAL-COMMUNITY-HOTLINE end -->

Public-information channels should not be used to disclose protected resident information unless release is authorized and permitted by applicable law and facility policy.

## Communication Documentation
External communications should be documented when they affect resident care, facility status reporting, resource requests, transfers, public messaging, regulatory reporting, emergency management coordination, or other response decisions. Documentation may include call logs, message logs, command center notes, action plans, agency reports, or recovery records.

Backup external communication devices, including portable radios, cell phones, satellite phones, and other assigned devices, should be returned, inventoried, and reconciled according to {{backup_communication_device_return_process}}. Ongoing external communication needs should transition into recovery, after-action, and plan-update processes.

## Coordination With Related Documents
This topic should be read with:

- Communications Plan, which defines the overall communication framework.
- Internal Communications During a Disaster, which covers staff and command-center communication methods.
- Resident and Family Information, which covers emergency plan information sharing with residents and representatives.
- Resident Medical Information and evacuation documents, which cover resident-specific information transfer and continuity-of-care documentation.
- Recovery documents, which capture after-action communication needs and follow-up reporting.

## What Staff Should Understand
- External communication must be coordinated through authorized leaders.
- Available outside communication methods may change depending on the disaster.
- Agency reporting, public information, and resident-specific information sharing have different approval and privacy expectations.
- Websites, hotlines, radios, health alert systems, and satellite phones should be used only when assigned and applicable.
- Important external communications should be documented as part of the response record.

## Customization Tokens
- `{{facility_name}}`
- `{{state_ltc_ombudsman_contact}}`
- `{{primary_emergency_contact_name}}`
- `{{facility_website}}`
- `{{communication_update_owner_title}}`
- `{{external_health_alert_system_name}}`
- `{{external_radio_system_location}}`
- `{{satellite_phone_location}}`
- `{{community_hotline_phone_number}}`
- `{{ares_cert_contact_process}}`
- `{{sister_system_facility_communications}}`
- `{{backup_communication_device_return_process}}`

## Compliance References
- `§483.73(b)`
- `§483.73(c)`
- `§483.73(c)(2)`
- `§483.73(c)(3)`
- `§483.73(c)(4)-(7)`
- `E-0013`
- `E-0029`
- `E-0031`
- `E-0032`
- `E-0033`
- `E-0034`

## Working Notes
- `{{include_sister_system_facilities_communication}}`: when `false`, export prep removes the sister/system facilities paragraph.
- `{{include_external_radio_system}}`: when `false`, export prep removes the local/regional/state radio system paragraph.
- `{{include_external_satellite_phone}}`: when `false`, export prep removes the satellite phone paragraph.
- `{{include_ares_cert_communication}}`: when `false`, export prep removes the ARES/CERT communication paragraph.
- `{{include_facility_website_reference}}`: when `false`, export prep removes the facility website paragraph.
- `{{include_community_hotline}}`: when `false`, export prep removes the community hotline paragraph.
