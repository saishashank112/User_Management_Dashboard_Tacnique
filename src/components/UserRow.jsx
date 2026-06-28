import React from 'react';

/** Colour map for department badges */
const DEPT_COLORS = {
  Engineering: 'badge-Engineering',
  Marketing: 'badge-Marketing',
  Finance: 'badge-Finance',
  Sales: 'badge-Sales',
  HR: 'badge-HR',
  IT: 'badge-IT',
  Operations: 'badge-Operations',
};

/**
 * UserRow — a single table row displaying one user with Edit & Delete actions.
 */
const UserRow = ({ user, index, onEdit, onDelete }) => {
  const deptClass = DEPT_COLORS[user.department] || 'badge-IT';

  // Seed avatar URL deterministically using first name
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`;

  return (
    <tr
      className="user-row"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* ID Chip column */}
      <td className="td td-id">
        <span className="id-chip">#{user.id}</span>
      </td>

      {/* Avatar column */}
      <td className="td" style={{ width: '60px', paddingRight: '0' }}>
        <div className="user-avatar-wrapper">
          <img
            src={avatarUrl}
            alt={`${user.firstName}'s avatar`}
            className="user-avatar-img"
            onError={(e) => {
              // Fail-safe local initials fallback
              e.target.style.display = 'none';
              e.target.parentNode.innerText = `${user.firstName[0] || 'U'}${user.lastName[0] || ''}`;
              e.target.parentNode.style.background = 'var(--accent-gradient)';
            }}
          />
        </div>
      </td>

      {/* Name and Email columns */}
      <td className="td td-name">{user.firstName}</td>
      <td className="td td-name">{user.lastName}</td>
      <td className="td td-email">
        <a
          href={`mailto:${user.email}`}
          className="email-link"
          onClick={(e) => e.preventDefault()}
        >
          {user.email}
        </a>
      </td>

      {/* Department badge column */}
      <td className="td">
        <span className={`dept-badge ${deptClass}`}>{user.department}</span>
      </td>

      {/* Actions column */}
      <td className="td td-actions">
        <div className="action-btns">
          <button
            id={`edit-btn-${user.id}`}
            className="icon-btn icon-btn--edit"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
            title="Edit user"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M10.5 1.5l3 3L4 14H1v-3L10.5 1.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            id={`delete-btn-${user.id}`}
            className="icon-btn icon-btn--delete"
            onClick={() => onDelete(user)}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
            title="Delete user"
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
          </button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(UserRow);
