"use client";

import { useState } from "react";
import { TextInput, DateInput, TextArea, Button } from "@/components/ui/inputs";
import { CASE_FIELDS, CASE_SECTIONS } from "@/constants";
import styles from "./CaseForm.module.css";

export default function CaseForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
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
  }));

  const [submitting, setSubmitting] = useState(false);

  function bind(field) {
    return {
      value: form[field],
      onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Parties Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>{CASE_SECTIONS.PARTIES.title}</h4>
        <div className={styles.grid}>
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
        </div>
      </div>

      {/* Case Info Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>{CASE_SECTIONS.CASE_INFO.title}</h4>
        <div className={styles.grid}>
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
        </div>
      </div>

      {/* Notes Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>{CASE_SECTIONS.NOTES.title}</h4>
        <TextArea
          placeholder={CASE_FIELDS.NOTES.placeholder}
          rows={5}
          {...bind("notes")}
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          ❌ გაუქმება
        </Button>
        <Button type="submit" loading={submitting}>
          💾 შენახვა
        </Button>
      </div>
    </form>
  );
}
