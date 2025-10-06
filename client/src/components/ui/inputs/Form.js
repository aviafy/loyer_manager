import styles from "./Form.module.css";

/**
 * Form wrapper component with standard layout and sections
 */
export default function Form({
  children,
  onSubmit,
  className = ""
}) {
  return (
    <form onSubmit={onSubmit} className={`${styles.form} ${className}`}>
      {children}
    </form>
  );
}

/**
 * Form section component
 */
export function FormSection({ title, children, className = "" }) {
  return (
    <div className={`${styles.section} ${className}`}>
      {title && <h4 className={styles.sectionTitle}>{title}</h4>}
      {children}
    </div>
  );
}

/**
 * Form grid for multiple fields
 */
export function FormGrid({ columns = 2, children, className = "" }) {
  return (
    <div
      className={`${styles.grid} ${className}`}
      style={{ "--columns": columns }}
    >
      {children}
    </div>
  );
}

/**
 * Form actions (buttons)
 */
export function FormActions({
  children,
  align = "end",
  className = ""
}) {
  const alignClass = styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`];

  return (
    <div className={`${styles.actions} ${alignClass} ${className}`}>
      {children}
    </div>
  );
}
