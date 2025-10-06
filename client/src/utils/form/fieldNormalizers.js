/**
 * Normalize phone number
 */
export function normalizePhone(value) {
  if (!value) return value;
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  return digits;
}

/**
 * Normalize currency amount
 */
export function normalizeCurrency(value) {
  if (!value) return value;
  // Remove currency symbols and spaces
  return value.replace(/[^\d.,-]/g, "");
}

/**
 * Normalize ID number (11 digits)
 */
export function normalizeIdNumber(value) {
  if (!value) return value;
  // Keep only digits
  const digits = value.replace(/\D/g, "");
  // Limit to 11 digits
  return digits.slice(0, 11);
}

/**
 * Normalize text (trim and single space)
 */
export function normalizeText(value) {
  if (!value) return value;
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Normalize email
 */
export function normalizeEmail(value) {
  if (!value) return value;
  return value.toLowerCase().trim();
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Capitalize each word
 */
export function capitalizeWords(value) {
  if (!value) return value;
  return value
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

/**
 * Format date for display
 */
export function formatDateDisplay(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("ka-GE");
}

/**
 * Format date for input
 */
export function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().split("T")[0];
}
