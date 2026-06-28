import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DEPARTMENTS } from '../utils/constants';

const EMPTY_FILTERS = {
  firstName: '',
  lastName: '',
  email: '',
  department: 'All',
};

/**
 * FilterPopup — slide-in panel with multi-field filter controls.
 * Calls onApply(filters) when the user clicks Apply.
 */
const FilterPopup = ({ isOpen, onClose, onApply, activeFilters }) => {
  const [localFilters, setLocalFilters] = useState(activeFilters || EMPTY_FILTERS);
  const panelRef = useRef(null);

  // Sync incoming active filters when the popup opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters || EMPTY_FILTERS);
    }
  }, [isOpen, activeFilters]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
    onClose();
  };

  const hasActiveFilters =
    localFilters.firstName ||
    localFilters.lastName ||
    localFilters.email ||
    localFilters.department !== 'All';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="popup-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        id="filter-popup"
        className="filter-popup"
        ref={panelRef}
        role="dialog"
        aria-label="Filter users"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        <div className="filter-popup-header">
          <div className="filter-popup-title-group">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 3h16M4 9h10M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <h2 className="filter-popup-title">Filter Users</h2>
          </div>
          <button
            id="filter-close-btn"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close filter panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="filter-popup-body">
          <div className="form-group">
            <label className="form-label" htmlFor="filter-firstName">First Name</label>
            <input
              id="filter-firstName"
              type="text"
              className="form-input"
              placeholder="e.g. Leanne"
              value={localFilters.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-lastName">Last Name</label>
            <input
              id="filter-lastName"
              type="text"
              className="form-input"
              placeholder="e.g. Graham"
              value={localFilters.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-email">Email</label>
            <input
              id="filter-email"
              type="text"
              className="form-input"
              placeholder="e.g. example@mail.com"
              value={localFilters.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="filter-department">Department</label>
            <select
              id="filter-department"
              className="form-input form-select"
              value={localFilters.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-popup-footer">
          <button
            id="filter-reset-btn"
            className="btn btn-ghost"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            id="filter-apply-btn"
            className="btn btn-primary"
            onClick={handleApply}
          >
            {hasActiveFilters ? 'Apply Filters' : 'Apply'}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FilterPopup;
