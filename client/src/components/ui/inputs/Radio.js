import styles from "./Radio.module.css";

export default function Radio({
  label,
  options = [],
  value,
  onChange,
  name,
  disabled = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <div className={styles.groupLabel}>{label}</div>}
      <div className={styles.options}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.label} ${disabled ? styles.disabled : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange && onChange(e.target.value)}
              disabled={disabled}
              className={styles.input}
              {...props}
            />
            <span className={styles.radio}></span>
            <span className={styles.labelText}>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
