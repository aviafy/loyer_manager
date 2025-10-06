/**
 * Validation rules for common field types
 */
export const validators = {
  required: (message = "This field is required") => (value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return message;
    }
    return null;
  },

  email: (message = "Invalid email address") => (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message || `Must be at most ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message = "Invalid format") => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  },

  min: (min, message) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < min) {
      return message || `Must be at least ${min}`;
    }
    return null;
  },

  max: (max, message) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num > max) {
      return message || `Must be at most ${max}`;
    }
    return null;
  },

  match: (fieldName, message) => (value, values) => {
    if (value !== values[fieldName]) {
      return message || `Must match ${fieldName}`;
    }
    return null;
  },

  phone: (message = "Invalid phone number") => (value) => {
    if (!value) return null;
    // Georgian phone: 9 digits (5XX XX XX XX) or 12 with country code (995 5XX XX XX XX)
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 9 && digits.length !== 12) {
      return message;
    }
    // Check Georgian mobile prefix (5XX)
    const prefix = digits.startsWith("995") ? digits.substring(3, 4) : digits.substring(0, 1);
    if (prefix !== "5") {
      return "Georgian mobile number must start with 5";
    }
    return null;
  },

  georgianId: (message = "Invalid Georgian ID") => (value) => {
    if (!value) return null;
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) {
      return message || "Georgian ID must be 11 digits";
    }
    return null;
  },

  url: (message = "Invalid URL") => (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  strongPassword: (message = "Password is too weak") => (value) => {
    if (!value) return null;
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber) {
      return message || "Password must be at least 8 characters and include uppercase, lowercase, and numbers";
    }
    return null;
  },
};

/**
 * Combine multiple validators
 */
export function combineValidators(...validatorFns) {
  return (value, values) => {
    for (const validator of validatorFns) {
      const error = validator(value, values);
      if (error) return error;
    }
    return null;
  };
}

/**
 * Create validation function for form
 */
export function createValidator(schema) {
  return (values) => {
    const errors = {};

    Object.keys(schema).forEach((fieldName) => {
      const fieldValidators = schema[fieldName];
      const value = values[fieldName];

      if (Array.isArray(fieldValidators)) {
        // Multiple validators
        for (const validator of fieldValidators) {
          const error = validator(value, values);
          if (error) {
            errors[fieldName] = error;
            break;
          }
        }
      } else if (typeof fieldValidators === "function") {
        // Single validator
        const error = fieldValidators(value, values);
        if (error) {
          errors[fieldName] = error;
        }
      }
    });

    return errors;
  };
}

/**
 * Hook for field-level validation
 */
export default function useFormValidation(schema) {
  return createValidator(schema);
}
