/**
 * Validate user registration data
 */
function validateRegisterData(data) {
  const errors = {};

  // Email validation
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Name validation
  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate user login data
 */
function validateLoginData(data) {
  const errors = {};

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  }

  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateRegisterData,
  validateLoginData,
};
