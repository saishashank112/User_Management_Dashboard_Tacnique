import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { validateForm } from '../utils/validators';
import { DEPARTMENTS } from '../utils/constants';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  department: 'IT',
};

/**
 * UserForm — modal for both "Add" and "Edit" user operations.
 * Pre-populates fields when `editingUser` is provided.
 */
const UserForm = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  const isEditing = Boolean(editingUser);
  const title = isEditing ? 'Edit User' : 'Add New User';
  const submitLabel = isEditing ? 'Save Changes' : 'Add User';

  const [departments, setDepartments] = useState(DEPARTMENTS);

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (isOpen) {
      // Load departments dynamically from localStorage
      const cached = localStorage.getItem('userflow_departments');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setDepartments(parsed.map(d => d.name));
          }
        } catch (e) {
          setDepartments(DEPARTMENTS);
        }
      } else {
        setDepartments(DEPARTMENTS);
      }

      setFormData(
        isEditing
          ? {
              firstName: editingUser.firstName || '',
              lastName: editingUser.lastName || '',
              email: editingUser.email || '',
              department: editingUser.department || 'IT',
            }
          : EMPTY_FORM
      );
      setErrors({});
      setSubmitting(false);
      // Focus first input after mount
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, editingUser, isEditing]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result?.success === false) {
      setErrors({ submit: result.message });
    } else {
      onClose();
    }
  };

  return (
    <>
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        id="user-form-modal"
        className="modal"
        role="dialog"
        aria-label={title}
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {isEditing ? (
                  <path
                    d="M13 1.5l3.5 3.5L5 16.5H1.5V13L13 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M9 1v16M1 9h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
            <h2 className="modal-title">{title}</h2>
          </div>
          <button
            id="form-close-btn"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close form"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form id="user-form" className="modal-body" onSubmit={handleSubmit} noValidate>
          {/* Submit-level error */}
          {errors.submit && (
            <div className="alert alert-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {errors.submit}
            </div>
          )}

          <div className="form-row">
            {/* First Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="form-firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                id="form-firstName"
                ref={firstInputRef}
                type="text"
                className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                placeholder="e.g. Leanne"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                aria-describedby={errors.firstName ? 'err-firstName' : undefined}
              />
              {errors.firstName && (
                <span id="err-firstName" className="form-error" role="alert">
                  {errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="form-lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="form-lastName"
                type="text"
                className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                placeholder="e.g. Graham"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                aria-describedby={errors.lastName ? 'err-lastName' : undefined}
              />
              {errors.lastName && (
                <span id="err-lastName" className="form-error" role="alert">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="form-email"
              type="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="e.g. leanne@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && (
              <span id="err-email" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-department">
              Department <span className="required">*</span>
            </label>
            <select
              id="form-department"
              className={`form-input form-select ${errors.department ? 'form-input--error' : ''}`}
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              aria-describedby={errors.department ? 'err-department' : undefined}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <span id="err-department" className="form-error" role="alert">
                {errors.department}
              </span>
            )}
          </div>

          {/* Footer actions */}
          <div className="modal-footer">
            <button
              id="form-cancel-btn"
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="form-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn-spinner" aria-label="Saving…" />
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default UserForm;
