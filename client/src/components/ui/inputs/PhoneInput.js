import { useState } from "react";
import styles from "./Input.module.css";

export default function PhoneInput({
  label,
  required = false,
  error,
  value = "",
  onChange,
  className = "",
  ...props
}) {
  const [formatted, setFormatted] = useState(value);

  const formatPhoneNumber = (input) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, "");

    // Georgian phone format: +995 XXX XX XX XX or XXX XX XX XX
    let formattedNumber = "";

    if (digits.startsWith("995")) {
      // International format
      formattedNumber = "+995";
      if (digits.length > 3) {
        formattedNumber += " " + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        formattedNumber += " " + digits.substring(6, 8);
      }
      if (digits.length > 8) {
        formattedNumber += " " + digits.substring(8, 10);
      }
      if (digits.length > 10) {
        formattedNumber += " " + digits.substring(10, 12);
      }
    } else {
      // Local format
      if (digits.length > 0) {
        formattedNumber = digits.substring(0, 3);
      }
      if (digits.length > 3) {
        formattedNumber += " " + digits.substring(3, 5);
      }
      if (digits.length > 5) {
        formattedNumber += " " + digits.substring(5, 7);
      }
      if (digits.length > 7) {
        formattedNumber += " " + digits.substring(7, 9);
      }
    }

    return formattedNumber;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setFormatted(formatted);

    // Send only digits to parent
    const digits = input.replace(/\D/g, "");
    if (onChange) {
      onChange({ target: { value: digits } });
    }
  };

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type="tel"
        className={`${styles.input} ${error ? styles.error : ""}`}
        value={formatted}
        onChange={handleChange}
        placeholder="5XX XX XX XX or +995 5XX XX XX XX"
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
