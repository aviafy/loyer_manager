import { useState } from "react";
import styles from "./Input.module.css";

export default function PasswordInput({
  label,
  required = false,
  error,
  value = "",
  onChange,
  showStrength = false,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;

    // Length
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Complexity
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { level: 1, text: "სუსტი", color: "#d32f2f" };
    } else if (strength <= 4) {
      return { level: 2, text: "საშუალო", color: "#ff9800" };
    } else if (strength <= 5) {
      return { level: 3, text: "კარგი", color: "#4caf50" };
    } else {
      return { level: 4, text: "ძლიერი", color: "#2e7d32" };
    }
  };

  const strength = showStrength ? calculateStrength(value) : null;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          className={`${styles.input} ${styles.passwordInput} ${error ? styles.error : ""}`}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          {...props}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      {showStrength && value && (
        <div className={styles.strengthMeter}>
          <div className={styles.strengthBar}>
            <div
              className={styles.strengthFill}
              style={{
                width: `${(strength.level / 4) * 100}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>
          <span className={styles.strengthText} style={{ color: strength.color }}>
            {strength.text}
          </span>
        </div>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
