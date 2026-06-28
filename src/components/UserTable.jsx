import React from 'react';
import UserRow from './UserRow';

/**
 * SortIcon — small directional arrow shown in active sort column header.
 */
const SortIcon = ({ field, sortField, sortOrder }) => {
  const isActive = field === sortField;
  return (
    <span className={`sort-icon ${isActive ? 'sort-icon--active' : ''}`} aria-hidden="true">
      {isActive ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅'}
    </span>
  );
};

/**
 * UserTable — renders the full data grid with sortable column headers.
 * Delegates individual rows to UserRow.
 */
const UserTable = ({ users, sortField, sortOrder, onSort, onEdit, onDelete, loading }) => {
  const headers = [
    { label: 'ID', field: 'id', sortable: true },
    { label: '', field: null, sortable: false }, // Avatar column placeholder
    { label: 'First Name', field: 'firstName', sortable: true },
    { label: 'Last Name', field: 'lastName', sortable: true },
    { label: 'Email', field: 'email', sortable: true },
    { label: 'Department', field: 'department', sortable: true },
    { label: 'Actions', field: null, sortable: false },
  ];

  const handleHeaderClick = (field) => {
    if (!field) return;
    if (sortField === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="table-wrapper">
        <table className="user-table" aria-label="Loading users">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="skeleton-row">
                {headers.map((h, j) => (
                  <td key={j}>
                    <div className="skeleton-cell" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!loading && users.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="32" cy="26" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <h3 className="empty-title">No users found</h3>
        <p className="empty-subtitle">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  // ── Data table ──────────────────────────────────────────────────────────
  return (
    <div className="table-wrapper">
      <table className="user-table" aria-label="Users list">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`table-th ${h.sortable ? 'table-th--sortable' : ''} ${
                  h.field === sortField ? 'table-th--active' : ''
                }`}
                onClick={() => handleHeaderClick(h.field)}
                aria-sort={
                  h.field === sortField
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : h.sortable
                    ? 'none'
                    : undefined
                }
              >
                <span className="th-content">
                  {h.label}
                  {h.sortable && (
                    <SortIcon field={h.field} sortField={sortField} sortOrder={sortOrder} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
