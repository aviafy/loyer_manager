import { useState, useCallback } from "react";

/**
 * Custom hook for form state management
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @param {Function} validate - Validation function
 */
export default function useForm(initialValues = {}, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle input blur
   */
  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field on blur
    if (validate) {
      const fieldErrors = validate({ ...values });
      if (fieldErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      }
    }
  }, [values, validate]);

  /**
   * Bind input props
   */
  const bind = useCallback((name) => {
    return {
      value: values[name] || "",
      onChange: (e) => {
        const value = e.target ? e.target.value : e;
        handleChange(name, value);
      },
      onBlur: () => handleBlur(name),
      error: touched[name] ? errors[name] : undefined,
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched(
          Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Handle server errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set field value programmatically
   */
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set field error programmatically
   */
  const setError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    bind,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setError,
    setErrors,
  };
}
