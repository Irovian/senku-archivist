# Appendix H - Staff Competency Post Training Test

## Purpose
This appendix defines the staff emergency preparedness competency quiz for {{facility_name}}. It keeps the appendix usable as a native Markdown record while preparing the content for structured digital entry and clean HTML/PDF export.

## Artifact Use
This appendix should support initial and annual emergency preparedness training by maintaining a question bank, answer key, passing threshold, and role or topic tags for staff competency review.

The legacy appendix design does not need to be preserved. The draft preserves the function, required evidence, and operational intent while giving the future renderer structured data to work with.

## Structured Artifact
```epp-artifact
schema_version: epp-artifact/v1
artifact_type: training_quiz
renderer_template: staff-competency-test-v1
render_intent:
  digital: quiz bank with role tags, answer key, and scoring metadata
  print: staff quiz plus optional answer key page
controls:
  - question records
  - answer options
  - single-choice controls
  - answer key
  - score threshold
  - role tags
record_schema:
  id_prefix: staff_competency_question
  repeatable: true
  fields:
    - id: question_text
      label: Question text
      control: textarea
      required: true
    - id: question_type
      label: Question type
      control: dropdown
      options: [single choice, multiple choice, true false, short answer]
    - id: answer_options
      label: Answer options
      control: repeatable_text
    - id: correct_answer
      label: Correct answer or answer key
      control: textarea
    - id: competency_domain
      label: Competency domain
      control: dropdown
      options: [emergency plan, incident command, communication, evacuation, shelter in place, utilities, resident safety, other]
    - id: audience_role
      label: Audience role
      control: multi_select
      options: [all staff, nursing, maintenance, dietary, administration, leadership, new hire, other]
    - id: rationale_or_feedback
      label: Rationale or feedback
      control: textarea
    - id: active_question
      label: Active question
      control: checkbox
outputs:
  - printable_quiz
  - answer_key
  - role_filtered_quiz
  - score_summary
review_questions:
  - Should the quiz be a static annual test or generated from tagged questions?
  - What score threshold should indicate competency?
  - Which questions should be role-specific versus all-staff?
```

## Maintenance
Review quiz content after policy changes, training updates, drills, and annual emergency preparedness review. Retire questions that no longer match approved procedures.

## What Staff Should Understand
- Quiz content should align with current approved policies.
- Role tags can support more useful training later.
- The answer key should be controlled separately when used for testing.

## Customization Tokens
- `{{facility_name}}`

## Compliance References
- `§483.73(d)(1)`
- `E-0037`
