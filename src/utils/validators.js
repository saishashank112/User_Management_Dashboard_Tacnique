/**
 * Validates the Add/Edit User form fields.
 * @param {Object} formData - { firstName, lastName, email, department }
 * @returns {Object} errors - keyed by field name; empty object means valid
 */
export const validateForm = (formData) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First Name is required';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First Name must be at least 2 characters';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last Name is required';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last Name must be at least 2 characters';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.department || !formData.department.trim()) {
    errors.department = 'Department is required';
  }

  return errors;
};

/**
 * Returns true if a validation errors object has no error keys.
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;
