# Internal Communications During a Disaster

## Purpose
This document explains how {{facility_name}} communicates internally during a disaster so staff, leaders, departments, and the command center can exchange timely instructions and status information.

## Internal Communication Priorities
Internal communication should support resident safety, staff accountability, emergency instructions, command-center coordination, department status reporting, resource requests, and documentation. Communication methods should be selected based on which systems are functional during the event.

The Incident Commander or designee should decide which communication methods are active, who may send facility-wide messages, how often updates are expected, and how urgent messages should be escalated.

## Primary and Backup Methods
The facility may use normal telephone systems, intercoms, public address systems, runners, written messages, website or intranet updates, and other methods approved by leadership.

Internal backup communication equipment and related supplies are obtained from {{internal_communication_equipment_locations}}.

<!-- assembly:ASM-INTERNAL-PORTABLE-RADIOS start -->
Portable radios are obtained from {{portable_radio_source_location}} and should be used according to the communication assignments established by the Incident Commander or designee.
<!-- assembly:ASM-INTERNAL-PORTABLE-RADIOS end -->

<!-- assembly:ASM-INTERNAL-BACKUP-CELL-PHONES start -->
Backup or emergency cell phones are obtained from {{backup_cell_phone_source_location}} and may be assigned to command staff, department leaders, transport staff, or other staff as needed.
<!-- assembly:ASM-INTERNAL-BACKUP-CELL-PHONES end -->

<!-- assembly:ASM-INTERNAL-WIRELESS-PAGER-SYSTEMS start -->
Wireless, pager, phone, or other device-based internal communication systems in place at the facility are {{internal_wireless_communication_systems}}.
<!-- assembly:ASM-INTERNAL-WIRELESS-PAGER-SYSTEMS end -->

<!-- assembly:ASM-INTERNAL-POWER-FAIL-PHONES start -->
Power-fail or emergency phones may be used when the internal phone system or power fails. Power-fail or emergency phone locations and numbers are maintained as {{power_fail_phone_locations}} and in the emergency resources or telephone-loss procedures.
<!-- assembly:ASM-INTERNAL-POWER-FAIL-PHONES end -->

<!-- assembly:ASM-INTERNAL-PUBLIC-PAY-PHONES start -->
Public or pay phones may be used for outgoing calls when they remain operational and safe to access. Public or pay phone locations are maintained as {{public_pay_phone_locations}}.
<!-- assembly:ASM-INTERNAL-PUBLIC-PAY-PHONES end -->

<!-- assembly:ASM-INTERNAL-SATELLITE-PHONE start -->
Satellite phone equipment is located at {{satellite_phone_location}} and may be used when normal internal or external communication methods are unavailable.
<!-- assembly:ASM-INTERNAL-SATELLITE-PHONE end -->

## Internal Information Updates
The facility may activate a recorded-message phone number for staff, resident, or internal emergency information. The internal recorded-message number is {{internal_recorded_message_phone_number}}.

<!-- assembly:ASM-INTERNAL-FACILITY-WEBSITE start -->
The facility website may be used for emergency updates when appropriate. The website address is {{facility_website}}, and {{communication_update_owner_title}} is authorized to coordinate real-time updates when assigned.
<!-- assembly:ASM-INTERNAL-FACILITY-WEBSITE end -->

<!-- assembly:ASM-INTERNAL-FACILITY-INTRANET start -->
The facility intranet, {{facility_intranet_name}}, may be used for staff-facing emergency updates when the platform is available. {{communication_update_owner_title}} is authorized to coordinate real-time intranet updates when assigned.
<!-- assembly:ASM-INTERNAL-FACILITY-INTRANET end -->

Internal messages should be brief, accurate, and repeated as needed. Staff should avoid sending conflicting instructions through multiple channels unless the Incident Commander or designee has approved the message.

## Communication Documentation
Important internal communications should be documented when they affect resident safety, staffing, assignments, resource requests, command decisions, evacuation or sheltering decisions, or operational changes. Documentation may occur through command logs, department reports, message logs, action plans, or other approved incident documentation.

Backup communication devices, including radios, cell phones, satellite phones, and other assigned devices, should be returned, recharged, inventoried, or otherwise reconciled after use according to {{backup_communication_device_return_process}}.

## Coordination With Related Documents
This topic should be read with:

- Communications Plan, which defines the overall communication framework.
- Emergency Codes and Activation of Emergency Operations Plan (EOP), which describe activation alerts and initial notification.
- Activation of the Incident Command System, which describes command center activation.
- External Communications During a Disaster, which covers agencies, partners, and public-information channels.
- Loss of Telephone Service / Internal Communications / Nurse Call and Section F resource lists, which maintain detailed locations, numbers, equipment, and backup procedures.

## What Staff Should Understand
- Internal communication methods may change as phones, power, internet, or other systems fail.
- Staff should follow the communication method selected by the Incident Commander or designee.
- Backup communication equipment must be accessible, tracked, and returned after use.
- Website, intranet, and recorded-message updates should be coordinated by authorized staff only.
- Internal communication supports command decisions and must be documented when it affects response actions.

## Customization Tokens
- `{{facility_name}}`
- `{{internal_communication_equipment_locations}}`
- `{{portable_radio_source_location}}`
- `{{backup_cell_phone_source_location}}`
- `{{internal_wireless_communication_systems}}`
- `{{power_fail_phone_locations}}`
- `{{public_pay_phone_locations}}`
- `{{internal_recorded_message_phone_number}}`
- `{{facility_website}}`
- `{{facility_intranet_name}}`
- `{{communication_update_owner_title}}`
- `{{satellite_phone_location}}`
- `{{backup_communication_device_return_process}}`

## Compliance References
- `§483.73(b)`
- `§483.73(c)`
- `§483.73(c)(3)`
- `E-0013`
- `E-0029`
- `E-0032`

## Working Notes
- `{{include_internal_portable_radios}}`: when `false`, export prep removes the portable radios paragraph.
- `{{include_internal_backup_cell_phones}}`: when `false`, export prep removes the backup cell phones paragraph.
- `{{include_internal_wireless_pager_systems}}`: when `false`, export prep removes the wireless/pager systems paragraph.
- `{{include_internal_power_fail_phones}}`: when `false`, export prep removes the power-fail or emergency phones paragraph.
- `{{include_internal_public_pay_phones}}`: when `false`, export prep removes the public/pay phones paragraph.
- `{{include_internal_satellite_phone}}`: when `false`, export prep removes the satellite phone paragraph.
- `{{include_facility_website_reference}}`: when `false`, export prep removes the website update paragraph.
- `{{include_facility_intranet_reference}}`: when `false`, export prep removes the intranet update paragraph.
