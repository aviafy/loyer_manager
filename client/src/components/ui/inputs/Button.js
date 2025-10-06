import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  size = "medium",
  className = "",
  ...props
}) {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size] || styles.medium;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${styles.button}
        ${variantClass}
        ${sizeClass}
        ${fullWidth ? styles.fullWidth : ""}
        ${loading ? styles.loading : ""}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.spinner}></span>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
