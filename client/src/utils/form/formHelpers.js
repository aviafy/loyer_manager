/**
 * Format form data before submission
 */
export function formatFormData(data, schema = {}) {
  const formatted = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const fieldSchema = schema[key];

    if (value === null || value === undefined || value === "") {
      // Skip empty values unless required
      if (!fieldSchema?.keepEmpty) {
        return;
      }
    }

    // Apply field-specific formatting
    if (fieldSchema?.type === "number") {
      formatted[key] = parseFloat(value);
    } else if (fieldSchema?.type === "boolean") {
      formatted[key] = Boolean(value);
    } else if (fieldSchema?.type === "date") {
      formatted[key] = value ? new Date(value).toISOString() : null;
    } else if (fieldSchema?.trim !== false && typeof value === "string") {
      formatted[key] = value.trim();
    } else {
      formatted[key] = value;
    }
  });

  return formatted;
}

/**
 * Parse server data for form
 */
export function parseFormData(data, schema = {}) {
  const parsed = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const fieldSchema = schema[key];

    if (fieldSchema?.type === "date" && value) {
      // Format date for input[type="date"]
      parsed[key] = new Date(value).toISOString().split("T")[0];
    } else if (value === null || value === undefined) {
      parsed[key] = fieldSchema?.defaultValue || "";
    } else {
      parsed[key] = value;
    }
  });

  return parsed;
}

/**
 * Get changed fields between two objects
 */
export function getChangedFields(original, current) {
  const changes = {};

  Object.keys(current).forEach((key) => {
    if (current[key] !== original[key]) {
      changes[key] = current[key];
    }
  });

  return changes;
}

/**
 * Check if form has changes
 */
export function hasFormChanges(original, current) {
  return Object.keys(getChangedFields(original, current)).length > 0;
}

/**
 * Reset specific fields in form
 */
export function resetFields(data, fields) {
  const reset = { ...data };
  fields.forEach((field) => {
    reset[field] = "";
  });
  return reset;
}

/**
 * Merge partial form data
 */
export function mergeFormData(original, updates) {
  return {
    ...original,
    ...updates,
  };
}

/**
 * Convert form errors from server format
 */
export function parseServerErrors(serverErrors) {
  if (!serverErrors) return {};

  // Handle different error formats
  if (typeof serverErrors === "string") {
    return { _global: serverErrors };
  }

  if (Array.isArray(serverErrors)) {
    return { _global: serverErrors.join(", ") };
  }

  // Already in correct format
  return serverErrors;
}
