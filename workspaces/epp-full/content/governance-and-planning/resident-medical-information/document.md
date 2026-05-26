# Resident Medical Information

## Purpose
This document explains how {{facility_name}} protects resident medical information, maintains record availability, and supports continuity of care when normal operations are disrupted.

## Records Protection and Availability
{{facility_name}} maintains emergency-ready processes for preserving resident medical information, protecting confidentiality, and keeping needed records available for resident care. These expectations apply to electronic records, paper records, hybrid record systems, and any approved backup or downtime process used by the facility.

{{medical_records_system_description}}

<!-- assembly:ASM-RESIDENT-MEDICAL-INFORMATION-EHR-SYSTEM-REFERENCE start -->
When electronic health records are used, {{facility_name}} identifies {{ehr_system_name}} as the EHR system and maintains backup, downtime, access, and security procedures for that system.
<!-- assembly:ASM-RESIDENT-MEDICAL-INFORMATION-EHR-SYSTEM-REFERENCE end -->

The facility's documentation approach should support secure access, backup or recovery planning, and protection of records from loss, damage, or unauthorized disclosure. Records should be stored, backed up, relocated, printed, accessed remotely, or otherwise protected according to the facility's approved medical-record and information-security procedures.

Medical record readiness is both a day-to-day responsibility and an emergency preparedness responsibility. Staff should understand where essential resident information is maintained, which roles are authorized to access it, and how downtime or disaster conditions change normal access methods.

## Confidentiality and Authorized Access
Resident information remains protected during emergencies. {{facility_name}} follows applicable privacy, confidentiality, release-of-information, and protected health information policies when resident information is accessed, used, shared, printed, transported, or transferred.

Emergency conditions may require faster information sharing, but they do not remove the need for role-based access and minimum-necessary disclosure. Staff should use approved communication channels and should not create informal copies, personal-device records, or unofficial resident lists unless the facility's emergency procedures specifically authorize that action.

## Continuity-of-Care Transfer
When residents are relocated, transferred, or otherwise affected by an emergency, {{facility_name}} uses approved processes to ensure necessary medical documentation follows the resident or is made available to the receiving care team through secure and permitted means. The information provided should be sufficient to support continuity of care, medication safety, resident identification, treatment decisions, and safe placement at the receiving location.

If the facility evacuates, relocates records internally, prints electronic documentation, uses remote access, or sends records with residents, those actions should be coordinated through assigned emergency roles. Detailed packet assembly, transport forms, evacuation record procedures, medication documentation steps, and resident tracking forms are maintained in the related evacuation and response documents rather than repeated here.

## Coordination With Related Documents
This topic establishes the policy expectation for protecting and maintaining resident medical information. It should be read with the documents that contain the operational detail:

- Communications describes the governance for emergency information sharing and reporting.
- Incident command documents identify roles responsible for communication, documentation, and release coordination during activation.
- Full Building Evacuation Plan documents describe the record packets, forms, and transfer steps used when residents are moved.
- Information technology, data security, or downtime procedures describe technical recovery steps when electronic systems are disrupted.

## What Staff Should Understand
- Resident medical information must remain protected and available during emergencies.
- Emergency record access and transfer should support continuity of care without bypassing confidentiality safeguards.
- Only authorized roles should release, share, print, transport, or transfer resident medical information.
- Minimum-necessary information sharing still applies during emergency operations.
- Detailed record packets, evacuation forms, downtime steps, and transfer workflows live in the related response, evacuation, incident command, and information-technology documents.

## Customization Tokens
- `{{facility_name}}`
- `{{medical_records_system_description}}`
- `{{ehr_system_name}}`

## Working Notes
- `{{include_ehr_system_reference}}`: when `false`, export prep removes the EHR-system sentence.
- Source footnote 27 was reviewed as context only: confirm evacuation record-transfer language reflects facility best practice before approval.

## Compliance References
- `§483.73(c)(4)-(7)`
- `E-0033`
- `E-0034`
