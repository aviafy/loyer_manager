import { useState } from "react";
import styles from "./Input.module.css";

export default function EmailInput({
  label,
  required = false,
  error,
  value = "",
  onChange,
  showValidation = true,
  className = "",
  ...props
}) {
  const [localError, setLocalError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "არასწორი ელ. ფოსტის ფორმატი";
  };

  const handleChange = (e) => {
    const newValue = e.target.value.toLowerCase().trim();

    if (onChange) {
      onChange({ target: { value: newValue } });
    }

    // Clear validation error when typing
    if (isTouched) {
      setLocalError("");
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (showValidation && value) {
      setLocalError(validateEmail(value));
    }
  };

  const displayError = error || (showValidation && isTouched ? localError : "");

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type="email"
          className={`${styles.input} ${displayError ? styles.error : ""}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="example@domain.com"
          autoComplete="email"
          {...props}
        />
        {value && !displayError && showValidation && isTouched && (
          <span className={styles.validIcon}>✓</span>
        )}
      </div>
      {displayError && <span className={styles.errorText}>{displayError}</span>}
    </div>
  );
}
