/**
 * Validate case creation/update data
 */
function validateCaseData(data) {
  const errors = {};

  // Required fields - customer references
  if (!data.plaintiffId || data.plaintiffId.trim() === "") {
    errors.plaintiffId = "Plaintiff is required";
  }

  if (!data.defendantId || data.defendantId.trim() === "") {
    errors.defendantId = "Defendant is required";
  }

  if (!data.clientId || data.clientId.trim() === "") {
    errors.clientId = "Client is required";
  }

  if (!data.clientRole || !["plaintiff", "defendant"].includes(data.clientRole)) {
    errors.clientRole = "Client role must be 'plaintiff' or 'defendant'";
  }

  // Validate dates if provided
  if (data.initiation_date && !isValidDate(data.initiation_date)) {
    errors.initiation_date = "Invalid date format";
  }

  if (data.hearing_date && !isValidDate(data.hearing_date)) {
    errors.hearing_date = "Invalid date format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate query parameters for case listing
 */
function validateCaseQuery(query) {
  const errors = {};

  const { page, limit, sort, order } = query;

  // Validate pagination
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.page = "Page must be a positive number";
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.limit = "Limit must be between 1 and 100";
  }

  // Validate sort
  const allowedSortFields = [
    "plaintiff",
    "defendant",
    "case_number",
    "amount",
    "court",
    "initiation_date",
    "hearing_date",
    "createdAt",
    "updatedAt",
  ];

  if (sort && !allowedSortFields.includes(sort)) {
    errors.sort = `Sort field must be one of: ${allowedSortFields.join(", ")}`;
  }

  // Validate order
  if (order && !["asc", "desc"].includes(order)) {
    errors.order = "Order must be 'asc' or 'desc'";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Helper: Check if date string is valid
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

module.exports = {
  validateCaseData,
  validateCaseQuery,
};
