import styles from "./Input.module.css";

export default function DateInput({
  label,
  required = false,
  error,
  className = "",
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
      <input
        type="date"
        className={`${styles.input} ${error ? styles.error : ""}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
