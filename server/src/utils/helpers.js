/**
 * Parse amount string to float
 * Handles various formats: "5000 ₾", "5,000.00", "5.000,00"
 */
function parseAmount(text) {
  if (text == null) return 0.0;
  let t = String(text).trim();
  if (!t) return 0.0;

  // Remove non-numeric characters except comma, dot, minus
  t = t.replace(/[^0-9,.-]/g, "");

  // Handle European format (comma as decimal separator)
  if (t.includes(",") && !t.includes(".")) {
    t = t.replace(/,/g, ".");
  } else {
    t = t.replace(/,/g, "");
  }

  const v = parseFloat(t);
  return Number.isNaN(v) ? 0.0 : v;
}

/**
 * Normalize string for consistent storage
 * Applies Unicode normalization (NFC)
 */
function normalize(str) {
  return (str || "").normalize("NFC");
}

/**
 * Build MongoDB query from search parameters
 */
function buildSearchQuery(search, field, fieldMap) {
  const q = {};

  if (!search) return q;

  const rx = new RegExp(search, "i");

  if (field) {
    const mapped = fieldMap[field] || field;

    // Handle ID search
    if (mapped === "_id") {
      if (/^[a-f0-9]{24}$/i.test(search)) {
        q._id = search;
      } else {
        // Search across all fields if ID format is invalid
        q.$or = buildTextSearchFields(rx);
      }
    } else {
      q[mapped] = rx;
    }
  } else {
    // Search all fields
    q.$or = buildTextSearchFields(rx);
  }

  return q;
}

/**
 * Build array of text search fields for $or query
 */
function buildTextSearchFields(regex) {
  return [
    { plaintiff: regex },
    { plaintiff_id: regex },
    { defendant: regex },
    { defendant_id: regex },
    { amount: regex },
    { court: regex },
    { case_number: regex },
    { initiation_date: regex },
    { hearing_date: regex },
    { notes: regex },
  ];
}

/**
 * Validate pagination parameters
 */
function validatePagination(page, limit) {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);
  return { pageNum, limitNum };
}

module.exports = {
  parseAmount,
  normalize,
  buildSearchQuery,
  buildTextSearchFields,
  validatePagination,
};

