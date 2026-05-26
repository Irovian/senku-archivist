# Job Action Sheets and Associated Forms

## Purpose
This support artifact indexes the incident-command job action sheets and associated forms used by {{facility_name}} during emergency response. It is designed as a navigable control page for digital use and as a clean printable reference for command-center binders.

## Artifact Use
The index helps the Incident Commander and command-center staff locate the correct role card, form, or tracking tool without hunting through the full Section C source. It preserves the function of the legacy job-action-sheet section while allowing each role card and form to become a linked, machine-readable artifact.

This document does not recreate every HICS form as a static page. It identifies the form library and role-to-form relationships so the later form/tool pass can render each form cleanly.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: artifact_index
renderer_template: artifact-index-v1
index_scope: incident_command_job_action_sheets_and_forms
controls:
  - role filter
  - form category filter
  - activation status
  - printable binder section
role_cards:
  - doc_id: DOC-INCIDENT_COMMAND-INCIDENT_COMMANDER
    title: Incident Commander
    category: command
  - doc_id: DOC-INCIDENT_COMMAND-DOCUMENTATION_RECORDER
    title: Documentation Recorder
    category: command_support
  - doc_id: DOC-INCIDENT_COMMAND-SAFETY_SECURITY_LIAISON_OFFICER
    title: Safety / Security / Liaison Officer
    category: command_support
  - doc_id: DOC-INCIDENT_COMMAND-PUBLIC_INFORMATION_OFFICER
    title: Public Information Officer
    category: command_support
  - doc_id: DOC-INCIDENT_COMMAND-LOGISTICS_SECTION_CHIEF
    title: Logistics Section Chief
    category: section_chief
  - doc_id: DOC-INCIDENT_COMMAND-PLANNING_SECTION_CHIEF
    title: Planning Section Chief
    category: section_chief
  - doc_id: DOC-INCIDENT_COMMAND-LABOR_POOL_UNIT_LEADER
    title: Labor Pool Unit Leader
    category: unit_leader
  - doc_id: DOC-INCIDENT_COMMAND-FLOOR_EVACUATION_TEAM_TEAM_LEADER
    title: Floor Evacuation Team - Team Leader
    category: evacuation_team
  - doc_id: DOC-INCIDENT_COMMAND-ELEVATOR_EVACUATION_TEAM_TEAM_LEADER
    title: Elevator Evacuation Team - Team Leader
    category: evacuation_team
  - doc_id: DOC-INCIDENT_COMMAND-STAIRWELL_EVACUATION_TEAM_TEAM_LEADER
    title: Stairwell Evacuation Team - Team Leader
    category: evacuation_team
  - doc_id: DOC-INCIDENT_COMMAND-DISCHARGE_FLOOR_EVACUATION_TEAM_TEAM_LEADER
    title: Discharge Floor Evacuation Team - Team Leader
    category: evacuation_team
  - doc_id: DOC-INCIDENT_COMMAND-FINANCE_SECTION_CHIEF
    title: Finance Section Chief
    category: section_chief
  - doc_id: DOC-INCIDENT_COMMAND-OPERATIONS_SECTION_CHIEF
    title: Operations Section Chief
    category: section_chief
  - doc_id: DOC-INCIDENT_COMMAND-NURSING_SUPERVISOR_DIRECTOR_OF_NURSING_CHARGE_NURSE_DEPARTMENT_DIRECTOR
    title: Nursing Supervisor / Director of Nursing / Charge Nurse / Department Director
    category: evacuation_operations
  - doc_id: DOC-INCIDENT_COMMAND-TRIAGE_UNIT_LEADER
    title: Triage Unit Leader
    category: evacuation_operations
  - doc_id: DOC-INCIDENT_COMMAND-HOLDING_AREA_UNIT_LEADER
    title: Holding Area Unit Leader
    category: evacuation_operations
form_library:
  - id: designated_area_locations_and_telephones
    title: Designated Area Locations and Telephones
    category: command_reference
  - id: hics_iap_quick_start
    title: HICS Incident Action Plan Quick Start
    category: incident_action_planning
  - id: hics_201a_incident_briefing
    title: HICS 201A - Incident Briefing
    category: incident_action_planning
  - id: hics_202a_incident_objectives
    title: HICS 202A - Incident Objectives
    category: incident_action_planning
  - id: hics_202b_section_incident_objectives
    title: HICS 202B - Section Incident Objectives
    category: incident_action_planning
  - id: hics_205a_communications_list_internal
    title: HICS 205A - Communications List Internal
    category: communications
  - id: hics_205a_communications_list_external
    title: HICS 205A - Communications List External / Emergency Agencies
    category: communications
  - id: hics_213a_incident_message_form
    title: HICS 213A - Incident Message Form
    category: communications
  - id: hics_214a_operations_log
    title: HICS 214A - Operations Log
    category: documentation
  - id: hics_251a_facility_systems_status_report
    title: HICS 251A - Facility Systems Status Report
    category: facility_systems
  - id: hics_252a_section_personnel_time_sheet
    title: HICS 252A - Section Personnel Time Sheet
    category: staffing_time
  - id: hics_256a_procurement_summary_report
    title: HICS 256A - Procurement Summary Report
    category: finance
  - id: hics_257a_resource_accounting_record
    title: HICS 257A - Resource Accounting Record
    category: resources
  - id: department_rapid_assessment_form
    title: Department Rapid Assessment Form
    category: assessment
  - id: unit_area_evacuation_status
    title: Unit / Area Evacuation Status
    category: evacuation_tracking
  - id: resident_medical_record_equipment_tracking_sheet
    title: Resident / Medical Record and Equipment Tracking Sheet
    category: evacuation_tracking
  - id: resident_destination_to_holding_area_form
    title: Resident Destination - To Holding Area Form
    category: evacuation_tracking
  - id: holding_area_arrival_tracking_form
    title: Holding Area Resident Arrival Tracking Form
    category: evacuation_tracking
  - id: holding_area_departure_tracking_form
    title: Holding Area Resident Departure Tracking Form
    category: evacuation_tracking
  - id: staff_equipment_tracking_holding_area
    title: Staff and Equipment Tracking Form - Holding Area
    category: evacuation_tracking
review_questions:
  - Should any HICS form be promoted to its own backlog document in the artifact pass?
  - Which forms should be available as digital-entry forms versus print-only templates?
  - Should the index group role cards by command section or by activation sequence?
```

## Maintenance
The facility should review this index annually, after exercises, and after incidents. Review should confirm role-card titles, form names, form availability, linked artifacts, and whether any legacy forms should be replaced by facility-specific digital tools.

## What Staff Should Understand
- Job action sheets are role cards used during response; they are not general policy narrative.
- Forms and tracking tools should be linked to the role that uses them most often.
- Some associated forms may become separate digital tools in the later form/artifact pass.
- The index should help staff find the right tool quickly during command-center operations.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(a)(3)`
- `§483.73(c)`
- `§483.73(c)(3)`
- `§483.73(d)`
- `E-0007`
- `E-0029`
- `E-0032`
- `E-0036`
