import styles from "./Input.module.css";

export default function TextArea({
  label,
  required = false,
  error,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        className={`${styles.textarea} ${error ? styles.error : ""}`}
        rows={rows}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
