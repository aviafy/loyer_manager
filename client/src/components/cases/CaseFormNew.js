"use client";

import { useState } from "react";
import { TextInput, DateInput, TextArea, Button, Select } from "@/components/ui/inputs";
import CustomerAutocomplete from "@/components/ui/inputs/CustomerAutocomplete";
import CustomerModal from "./CustomerModal";
import { CASE_FIELDS, CASE_SECTIONS } from "@/constants";
import styles from "./CaseForm.module.css";

export default function CaseForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    plaintiffId: initial.plaintiffId || null,
    defendantId: initial.defendantId || null,
    clientId: initial.clientId || null,
    clientRole: initial.clientRole || "",
    amount: initial.amount || "",
    court: initial.court || "",
    case_number: initial.case_number || "",
    initiation_date: initial.initiation_date || "",
    hearing_date: initial.hearing_date || "",
    notes: initial.notes || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalFor, setCustomerModalFor] = useState(null); // 'plaintiff' or 'defendant'

  function bind(field) {
    return {
      value: form[field],
      onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
    };
  }

  const handleCustomerChange = (field, customer) => {
    setForm((f) => ({ ...f, [field]: customer }));

    // Auto-set clientId if not set
    if (!f.clientId && customer) {
      setForm((prev) => ({ ...prev, clientId: customer }));

      // Auto-set clientRole based on which field was set
      if (field === "plaintiffId" && !prev.clientRole) {
        setForm((prev2) => ({ ...prev2, clientRole: "plaintiff" }));
      } else if (field === "defendantId" && !prev.clientRole) {
        setForm((prev2) => ({ ...prev2, clientRole: "defendant" }));
      }
    }
  };

  const handleCreateCustomer = (forField) => {
    setCustomerModalFor(forField);
    setShowCustomerModal(true);
  };

  const handleCustomerCreated = (newCustomer) => {
    if (customerModalFor === "plaintiff") {
      handleCustomerChange("plaintiffId", newCustomer);
    } else if (customerModalFor === "defendant") {
      handleCustomerChange("defendantId", newCustomer);
    }
    setShowCustomerModal(false);
    setCustomerModalFor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.plaintiffId) {
      alert("გთხოვთ აირჩიოთ მოსარჩელე");
      return;
    }
    if (!form.defendantId) {
      alert("გთხოვთ აირჩიოთ მოპასუხე");
      return;
    }
    if (!form.clientRole) {
      alert("გთხოვთ მიუთითოთ ვინ არის თქვენი კლიენტი");
      return;
    }

    setSubmitting(true);
    try {
      // Send only IDs to backend
      const payload = {
        plaintiffId: form.plaintiffId._id,
        defendantId: form.defendantId._id,
        clientId: form.clientRole === "plaintiff" ? form.plaintiffId._id : form.defendantId._id,
        clientRole: form.clientRole,
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
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Parties Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{CASE_SECTIONS.PARTIES.title}</h4>
          <div className={styles.grid}>
            <CustomerAutocomplete
              label={CASE_FIELDS.PLAINTIFF.label}
              required={CASE_FIELDS.PLAINTIFF.required}
              value={form.plaintiffId}
              onChange={(customer) => handleCustomerChange("plaintiffId", customer)}
              onCreateNew={() => handleCreateCustomer("plaintiff")}
            />
            <CustomerAutocomplete
              label={CASE_FIELDS.DEFENDANT.label}
              required={CASE_FIELDS.DEFENDANT.required}
              value={form.defendantId}
              onChange={(customer) => handleCustomerChange("defendantId", customer)}
              onCreateNew={() => handleCreateCustomer("defendant")}
            />
          </div>

          {/* Who is your client? */}
          <div className={styles.clientSelector}>
            <label className={styles.clientLabel}>ვინ არის თქვენი კლიენტი? *</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="clientRole"
                  value="plaintiff"
                  checked={form.clientRole === "plaintiff"}
                  onChange={bind("clientRole").onChange}
                  disabled={!form.plaintiffId}
                />
                <span>მოსარჩელე</span>
                {form.plaintiffId && <span className={styles.clientName}>({form.plaintiffId.name})</span>}
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="clientRole"
                  value="defendant"
                  checked={form.clientRole === "defendant"}
                  onChange={bind("clientRole").onChange}
                  disabled={!form.defendantId}
                />
                <span>მოპასუხე</span>
                {form.defendantId && <span className={styles.clientName}>({form.defendantId.name})</span>}
              </label>
            </div>
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

      {showCustomerModal && (
        <CustomerModal
          onClose={() => setShowCustomerModal(false)}
          onSave={handleCustomerCreated}
        />
      )}
    </>
  );
}
