"use client";

import {
  TextInput,
  DateInput,
  TextArea,
  Button,
  Form,
  FormSection,
  FormGrid,
  FormActions,
} from "@/components/ui/inputs";
import { useForm, validators, createValidator } from "@/hooks";
import { CASE_FIELDS, CASE_SECTIONS } from "@/constants";

// Define validation schema
const validationSchema = createValidator({
  plaintiff: validators.required("მოსარჩელე სავალდებულოა"),
  defendant: validators.required("მოპასუხე სავალდებულოა"),
  plaintiff_id: validators.pattern(
    /^\d{11}$/,
    "საიდენთიფიკაციო ნომერი უნდა იყოს 11 ციფრი"
  ),
  defendant_id: validators.pattern(
    /^\d{11}$/,
    "საიდენთიფიკაციო ნომერი უნდა იყოს 11 ციფრი"
  ),
});

export default function CaseFormRefactored({ initial = {}, onSubmit, onCancel }) {
  const { bind, handleSubmit, isSubmitting } = useForm(
    {
      plaintiff: initial.plaintiff || "",
      plaintiff_id: initial.plaintiff_id || "",
      defendant: initial.defendant || "",
      defendant_id: initial.defendant_id || "",
      amount: initial.amount || "",
      court: initial.court || "",
      case_number: initial.case_number || "",
      initiation_date: initial.initiation_date || "",
      hearing_date: initial.hearing_date || "",
      notes: initial.notes || "",
    },
    onSubmit,
    validationSchema
  );

  return (
    <Form onSubmit={handleSubmit}>
      {/* Parties Section */}
      <FormSection title={CASE_SECTIONS.PARTIES.title}>
        <FormGrid columns={2}>
          <TextInput
            label={CASE_FIELDS.PLAINTIFF.label}
            placeholder={CASE_FIELDS.PLAINTIFF.placeholder}
            required={CASE_FIELDS.PLAINTIFF.required}
            {...bind("plaintiff")}
          />
          <TextInput
            label={CASE_FIELDS.PLAINTIFF_ID.label}
            placeholder={CASE_FIELDS.PLAINTIFF_ID.placeholder}
            {...bind("plaintiff_id")}
          />
          <TextInput
            label={CASE_FIELDS.DEFENDANT.label}
            placeholder={CASE_FIELDS.DEFENDANT.placeholder}
            required={CASE_FIELDS.DEFENDANT.required}
            {...bind("defendant")}
          />
          <TextInput
            label={CASE_FIELDS.DEFENDANT_ID.label}
            placeholder={CASE_FIELDS.DEFENDANT_ID.placeholder}
            {...bind("defendant_id")}
          />
        </FormGrid>
      </FormSection>

      {/* Case Info Section */}
      <FormSection title={CASE_SECTIONS.CASE_INFO.title}>
        <FormGrid columns={2}>
          <TextInput
            label={CASE_FIELDS.CASE_NUMBER.label}
            placeholder={CASE_FIELDS.CASE_NUMBER.placeholder}
            {...bind("case_number")}
          />
          <TextInput
            label={CASE_FIELDS.AMOUNT.label}
            placeholder={CASE_FIELDS.AMOUNT.placeholder}
            {...bind("amount")}
          />
          <TextInput
            label={CASE_FIELDS.COURT.label}
            placeholder={CASE_FIELDS.COURT.placeholder}
            {...bind("court")}
          />
          <DateInput
            label={CASE_FIELDS.INITIATION_DATE.label}
            {...bind("initiation_date")}
          />
          <DateInput
            label={CASE_FIELDS.HEARING_DATE.label}
            {...bind("hearing_date")}
          />
        </FormGrid>
      </FormSection>

      {/* Notes Section */}
      <FormSection title={CASE_SECTIONS.NOTES.title}>
        <TextArea
          placeholder={CASE_FIELDS.NOTES.placeholder}
          rows={5}
          {...bind("notes")}
        />
      </FormSection>

      {/* Actions */}
      <FormActions>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ❌ გაუქმება
        </Button>
        <Button type="submit" loading={isSubmitting}>
          💾 შენახვა
        </Button>
      </FormActions>
    </Form>
  );
}
