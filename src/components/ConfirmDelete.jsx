import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * ConfirmDelete — safety confirmation modal shown before deleting a user.
 * Requires an explicit "Delete" button click to proceed.
 */
const ConfirmDelete = ({ isOpen, user, onConfirm, onCancel }) => {
  const cancelBtnRef = useRef(null);

  // Focus the cancel button by default (safer UX — prevents accidental Enter-to-confirm)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <motion.div
        className="modal-backdrop"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        id="confirm-delete-modal"
        className="modal modal--danger"
        role="alertdialog"
        aria-label="Confirm delete"
        aria-modal="true"
        aria-describedby="delete-description"
        initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {/* Warning icon */}
        <div className="danger-icon-wrap">
          <div className="danger-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L2 24h24L14 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M14 10v6M14 19v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="modal-title modal-title--center">Delete User</h2>

        <p id="delete-description" className="delete-message">
          Are you sure you want to delete{' '}
          <strong className="delete-name">{fullName}</strong>?
          <br />
          <span className="delete-sub">This action cannot be undone.</span>
        </p>

        <div className="modal-footer modal-footer--centered">
          <button
            id="cancel-delete-btn"
            ref={cancelBtnRef}
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
              <path
                d="M1 3.5h12M5 3.5V2h4v1.5M2 3.5l.8 9.5c0 .55.45 1 1 1h6.4c.55 0 1-.45 1-1l.8-9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete User
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmDelete;
