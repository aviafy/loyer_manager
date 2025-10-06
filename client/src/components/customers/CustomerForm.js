"use client";

import { useState } from "react";
import { TextInput, TextArea, Button } from "@/components/ui/inputs";
import styles from "./CustomerForm.module.css";

export default function CustomerForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    address: initial.address || "",
    nationalId: initial.nationalId || "",
    notes: initial.notes || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const bind = (field) => ({
    value: form[field],
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("სახელი სავალდებულოა");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(form);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "შენახვა ვერ მოხერხდა");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>ძირითადი ინფორმაცია</h4>
        <TextInput
          label="სახელი და გვარი"
          placeholder="მაგ: გიორგი მელაძე"
          required
          {...bind("name")}
        />

        <div className={styles.row}>
          <TextInput
            label="ელ. ფოსტა"
            type="email"
            placeholder="example@email.com"
            {...bind("email")}
          />
          <TextInput
            label="ტელეფონი"
            placeholder="+995 555 123 456"
            {...bind("phone")}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>დამატებითი ინფორმაცია</h4>
        <TextInput
          label="მისამართი"
          placeholder="ქალაქი, ქუჩა, ნომერი"
          {...bind("address")}
        />

        <TextInput
          label="პირადი ნომერი"
          placeholder="01001234567"
          maxLength={11}
          {...bind("nationalId")}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>შენიშვნები</h4>
        <TextArea
          placeholder="დამატებითი ინფორმაცია კლიენტის შესახებ..."
          rows={4}
          {...bind("notes")}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
        >
          გაუქმება
        </Button>
        <Button type="submit" loading={saving}>
          შენახვა
        </Button>
      </div>
    </form>
  );
}
