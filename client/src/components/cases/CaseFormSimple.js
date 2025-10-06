"use client";

import { useState } from "react";
import { TextInput, DateInput, TextArea, Button } from "@/components/ui/inputs";
import CustomerSelector from "./CustomerSelector";
import { CASE_FIELDS, CASE_SECTIONS } from "@/constants";
import styles from "./CaseFormSimple.module.css";

export default function CaseForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    plaintiff: initial.plaintiffId || null,
    defendant: initial.defendantId || null,
    whoIsClient: initial.clientRole || "", // 'plaintiff' or 'defendant'
    amount: initial.amount || "",
    court: initial.court || "",
    case_number: initial.case_number || "",
    initiation_date: initial.initiation_date || "",
    hearing_date: initial.hearing_date || "",
    notes: initial.notes || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function bind(field) {
    return {
      value: form[field],
      onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
    };
  }

  const validateForm = () => {
    const newErrors = {};

    if (!form.plaintiff) {
      newErrors.plaintiff = "აირჩიეთ მოსარჩელე";
    }

    if (!form.defendant) {
      newErrors.defendant = "აირჩიეთ მოპასუხე";
    }

    if (!form.whoIsClient) {
      newErrors.whoIsClient = "აირჩიეთ ვინ არის თქვენი კლიენტი";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        plaintiffId: form.plaintiff._id,
        defendantId: form.defendant._id,
        clientId: form.whoIsClient === "plaintiff" ? form.plaintiff._id : form.defendant._id,
        clientRole: form.whoIsClient,
        amount: form.amount,
        court: form.court,
        case_number: form.case_number,
        initiation_date: form.initiation_date,
        hearing_date: form.hearing_date,
        notes: form.notes,
      };

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Step 1: Choose Parties */}
      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>1</span>
          <h3 className={styles.stepTitle}>აირჩიეთ საქმის მხარეები</h3>
        </div>

        <div className={styles.stepContent}>
          <CustomerSelector
            label="მოსარჩელე (ვინ შეიტანს სარჩელს)"
            value={form.plaintiff}
            onChange={(customer) => {
              setForm((f) => ({ ...f, plaintiff: customer }));
              setErrors((e) => ({ ...e, plaintiff: null }));
            }}
            error={errors.plaintiff}
            placeholder="მოძებნეთ ან დაამატეთ მოსარჩელე..."
          />

          <CustomerSelector
            label="მოპასუხე (ვის წინააღმდეგ არის სარჩელი)"
            value={form.defendant}
            onChange={(customer) => {
              setForm((f) => ({ ...f, defendant: customer }));
              setErrors((e) => ({ ...e, defendant: null }));
            }}
            error={errors.defendant}
            placeholder="მოძებნეთ ან დაამატეთ მოპასუხე..."
          />
        </div>
      </div>

      {/* Step 2: Who is your client */}
      {(form.plaintiff || form.defendant) && (
        <div className={styles.step}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNumber}>2</span>
            <h3 className={styles.stepTitle}>ვინ არის თქვენი კლიენტი?</h3>
          </div>

          <div className={styles.stepContent}>
            <p className={styles.helpText}>
              აირჩიეთ რომელ მხარეს წარმოადგენთ ამ საქმეში
            </p>

            <div className={styles.clientOptions}>
              {form.plaintiff && (
                <button
                  type="button"
                  className={`${styles.clientOption} ${
                    form.whoIsClient === "plaintiff" ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setForm((f) => ({ ...f, whoIsClient: "plaintiff" }));
                    setErrors((e) => ({ ...e, whoIsClient: null }));
                  }}
                >
                  <div className={styles.optionIcon}>👤</div>
                  <div className={styles.optionContent}>
                    <div className={styles.optionLabel}>მოსარჩელე</div>
                    <div className={styles.optionName}>{form.plaintiff.name}</div>
                    {form.plaintiff.phone && (
                      <div className={styles.optionDetail}>{form.plaintiff.phone}</div>
                    )}
                  </div>
                  {form.whoIsClient === "plaintiff" && (
                    <div className={styles.checkmark}>✓</div>
                  )}
                </button>
              )}

              {form.defendant && (
                <button
                  type="button"
                  className={`${styles.clientOption} ${
                    form.whoIsClient === "defendant" ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setForm((f) => ({ ...f, whoIsClient: "defendant" }));
                    setErrors((e) => ({ ...e, whoIsClient: null }));
                  }}
                >
                  <div className={styles.optionIcon}>👤</div>
                  <div className={styles.optionContent}>
                    <div className={styles.optionLabel}>მოპასუხე</div>
                    <div className={styles.optionName}>{form.defendant.name}</div>
                    {form.defendant.phone && (
                      <div className={styles.optionDetail}>{form.defendant.phone}</div>
                    )}
                  </div>
                  {form.whoIsClient === "defendant" && (
                    <div className={styles.checkmark}>✓</div>
                  )}
                </button>
              )}
            </div>

            {errors.whoIsClient && (
              <div className={styles.errorText}>{errors.whoIsClient}</div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Case Details */}
      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <span className={styles.stepNumber}>3</span>
          <h3 className={styles.stepTitle}>საქმის დეტალები</h3>
        </div>

        <div className={styles.stepContent}>
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

          <TextArea
            label="დამატებითი შენიშვნები"
            placeholder="დაწერეთ ნებისმიერი დამატებითი ინფორმაცია საქმის შესახებ..."
            rows={4}
            {...bind("notes")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          გაუქმება
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? "ინახება..." : "საქმის შენახვა"}
        </Button>
      </div>
    </form>
  );
}
