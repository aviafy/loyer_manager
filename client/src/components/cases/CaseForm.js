"use client";

import { useState } from "react";
import useResponsive from "@/hooks/useResponsive";
import styles from "./CaseForm.module.css";

export default function CaseForm({ initial = {}, onSubmit, onCancel }) {
  const { isMobile } = useResponsive();
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
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>მხარეები</h4>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>
              მოსარჩელე <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...bind("plaintiff")}
              placeholder="შეიყვანეთ მოსარჩელის სახელი"
              required
            />
          </div>
          <div className={styles.field}>
            <label>საიდენთიფიკაციო ნომერი (მოს.)</label>
            <input
              type="text"
              {...bind("plaintiff_id")}
              placeholder="მაგ: 01001234567"
            />
          </div>
          <div className={styles.field}>
            <label>
              მოპასუხე <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...bind("defendant")}
              placeholder="შეიყვანეთ მოპასუხის სახელი"
              required
            />
          </div>
          <div className={styles.field}>
            <label>საიდენთიფიკაციო ნომერი (მოპ.)</label>
            <input
              type="text"
              {...bind("defendant_id")}
              placeholder="მაგ: 01001234567"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>საქმის ინფორმაცია</h4>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>საქმის ნომერი</label>
            <input
              type="text"
              {...bind("case_number")}
              placeholder="მაგ: 2/1234-23"
            />
          </div>
          <div className={styles.field}>
            <label>მოთხოვნის ოდენობა</label>
            <input type="text" {...bind("amount")} placeholder="მაგ: 5000 ₾" />
          </div>
          <div className={styles.field}>
            <label>განმხილველი ორგანო</label>
            <input
              type="text"
              {...bind("court")}
              placeholder="მაგ: თბილისის საქალაქო სასამართლო"
            />
          </div>
          <div className={styles.field}>
            <label>წარმოებაში მიღების თარიღი</label>
            <input type="date" {...bind("initiation_date")} />
          </div>
          <div className={styles.field}>
            <label>სხდომის თარიღი</label>
            <input type="date" {...bind("hearing_date")} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>კომენტარი</h4>
        <div className={styles.field}>
          <textarea
            {...bind("notes")}
            placeholder="დამატებითი ინფორმაცია..."
            rows={5}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className="secondary"
          disabled={submitting}
        >
          ❌ გაუქმება
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? "მიმდინარეობს..." : "💾 შენახვა"}
        </button>
      </div>
    </form>
  );
}
