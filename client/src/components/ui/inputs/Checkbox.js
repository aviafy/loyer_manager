import styles from "./Checkbox.module.css";

export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      <label className={`${styles.label} ${disabled ? styles.disabled : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
          {...props}
        />
        <span className={styles.checkmark}></span>
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
