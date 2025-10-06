"use client";

import { useState } from "react";
import { customerService } from "@/services";
import { TextInput, Button } from "@/components/ui/inputs";
import styles from "./CustomerModal.module.css";

export default function CustomerModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nationalId: "",
    notes: "",
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
      const newCustomer = await customerService.createCustomer(form);
      onSave(newCustomer);
    } catch (err) {
      console.error("Create customer error:", err);
      setError("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>ახალი კლიენტის დამატება</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextInput
            label="სახელი"
            placeholder="შეიყვანეთ სახელი"
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

          <TextInput
            label="მისამართი"
            placeholder="შეიყვანეთ მისამართი"
            {...bind("address")}
          />

          <TextInput
            label="პირადი ნომერი"
            placeholder="01001234567"
            {...bind("nationalId")}
          />

          <TextInput
            label="შენიშვნები"
            placeholder="დამატებითი ინფორმაცია..."
            {...bind("notes")}
          />

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              გაუქმება
            </Button>
            <Button type="submit" loading={saving}>
              დამატება
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
