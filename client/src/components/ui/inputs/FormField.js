import styles from "./FormField.module.css";

/**
 * Wrapper component for form fields
 * Provides consistent layout and error handling
 */
export default function FormField({
  label,
  required = false,
  error,
  helpText,
  children,
  className = "",
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <span className={styles.helpText}>{helpText}</span>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
