import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Engineering', manager: 'Alex Rivera', employees: 2, description: 'Software architecture, frontend/backend engineering, and site reliability.' },
  { id: 2, name: 'Marketing', manager: 'Sarah Jenkins', employees: 2, description: 'Branding, campaign execution, product marketing, and SEO growth.' },
  { id: 3, name: 'Sales', manager: 'Michael Chang', employees: 2, description: 'Enterprise sales, account management, and strategic partnerships.' },
  { id: 4, name: 'HR', manager: 'Emma Watson', employees: 1, description: 'Talent acquisition, employee success, culture, and benefits.' },
  { id: 5, name: 'IT', manager: 'David Miller', employees: 2, description: 'Helpdesk support, security compliance, and network systems management.' },
  { id: 6, name: 'Finance', manager: 'Sophia Patel', employees: 1, description: 'Financial planning, accounting, tax compliance, and analytics.' },
  { id: 7, name: 'Operations', manager: 'James Wilson', employees: 1, description: 'Business strategy, logistical workflows, and internal tooling.' },
];

const EMPTY_DEPT_FORM = {
  name: '',
  manager: '',
  employees: 1,
  description: '',
};

const Departments = ({ addDeptTrigger }) => {
  const [depts, setDepts] = useState(() => {
    const cached = localStorage.getItem('userflow_departments');
    return cached ? JSON.parse(cached) : INITIAL_DEPARTMENTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Save to localStorage when depts changes
  useEffect(() => {
    localStorage.setItem('userflow_departments', JSON.stringify(depts));
  }, [depts]);

  // Modal & form states
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState(EMPTY_DEPT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Trigger from topbar Add Dept button
  useEffect(() => {
    if (addDeptTrigger > 0) {
      setEditingDept(null);
      setFormData(EMPTY_DEPT_FORM);
      setFormErrors({});
      setShowForm(true);
    }
  }, [addDeptTrigger]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filter and Sort Pipeline ───────────────────────────────────────────────
  const filteredDepts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return depts;
    return depts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.manager.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [depts, searchQuery]);

  const sortedDepts = useMemo(() => {
    return [...filteredDepts].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredDepts, sortField, sortOrder]);

  // Sort toggle handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CRUD actions
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      manager: dept.manager,
      employees: dept.employees,
      description: dept.description,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDeleteClick = (dept) => {
    setDeleteTarget(dept);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDepts(depts.filter((d) => d.id !== deleteTarget.id));
    showToast(`Department "${deleteTarget.name}" deleted successfully.`, 'info');
    setDeleteTarget(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Department Name is required';
    if (!formData.manager.trim()) errors.manager = 'Manager Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.employees < 1) errors.employees = 'Must have at least 1 employee';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingDept) {
      // Update
      setDepts(
        depts.map((d) => (d.id === editingDept.id ? { ...d, ...formData } : d))
      );
      showToast(`Department "${formData.name}" updated successfully.`);
    } else {
      // Create
      const newId = depts.length > 0 ? Math.max(...depts.map((d) => d.id)) + 1 : 1;
      setDepts([...depts, { id: newId, ...formData }]);
      showToast(`Department "${formData.name}" created successfully.`);
    }

    setShowForm(false);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  return (
    <motion.div
      className="main-content"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Metric Summary Cards ────────────────────────────────────────────── */}
      <div className="stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon-wrapper stat-icon-blue">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H3" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Departments</span>
            <div className="stat-value-group">
              <span className="stat-value">{depts.length}</span>
              <span className="stat-trend stat-trend--up">Active</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-icon-wrapper stat-icon-indigo">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Employees</span>
            <div className="stat-value-group">
              <span className="stat-value">
                {depts.reduce((sum, d) => sum + Number(d.employees || 0), 0)}
              </span>
              <span className="stat-trend stat-trend--up">Registered</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Search bar controls ──────────────────────────────────────────────── */}
      <div className="controls-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="dept-search-input"
              type="text"
              className="search-input"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Grid Card ─────────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="user-table" aria-label="Departments list">
            <thead>
              <tr>
                <th className="table-th table-th--sortable" onClick={() => handleSort('id')}>
                  <span className="th-content">ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
                </th>
                <th className="table-th table-th--sortable" onClick={() => handleSort('name')}>
                  <span className="th-content">Dept Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
                </th>
                <th className="table-th table-th--sortable" onClick={() => handleSort('manager')}>
                  <span className="th-content">Manager {sortField === 'manager' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
                </th>
                <th className="table-th table-th--sortable" onClick={() => handleSort('employees')}>
                  <span className="th-content">Employees {sortField === 'employees' && (sortOrder === 'asc' ? '↑' : '↓')}</span>
                </th>
                <th className="table-th">Description</th>
                <th className="table-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDepts.map((dept, index) => (
                <tr key={dept.id} className="user-row" style={{ animationDelay: `${index * 30}ms` }}>
                  <td className="td td-id">
                    <span className="id-chip">#D{dept.id}</span>
                  </td>
                  <td className="td td-name">{dept.name}</td>
                  <td className="td" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{dept.manager}</td>
                  <td className="td">
                    <span className="dept-badge badge-Engineering" style={{ fontWeight: 700 }}>
                      {dept.employees} headcount
                    </span>
                  </td>
                  <td className="td" style={{ fontSize: '0.84rem', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dept.description}
                  </td>
                  <td className="td td-actions">
                    <div className="action-btns">
                      <button
                        className="icon-btn icon-btn--edit"
                        onClick={() => handleEditClick(dept)}
                        title="Edit Department"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M10.5 1.5l3 3L4 14H1v-3L10.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn icon-btn--delete"
                        onClick={() => handleDeleteClick(dept)}
                        title="Delete Department"
                      >
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
                          <path d="M1 3.5h12M5 3.5V2h4v1.5M2 3.5l.8 9.5c0 .55.45 1 1 1h6.4c.55 0 1-.45 1-1l.8-9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CRUD Modal Form ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="modal-backdrop"
              onClick={() => setShowForm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="modal-header">
                <div className="modal-title-group">
                  <div className="modal-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </div>
                  <h2 className="modal-title">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
                </div>
                <button className="icon-btn" onClick={() => setShowForm(false)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="dept-name">Dept Name *</label>
                  <input
                    id="dept-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'form-input--error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Sales"
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dept-manager">Manager *</label>
                  <input
                    id="dept-manager"
                    type="text"
                    className={`form-input ${formErrors.manager ? 'form-input--error' : ''}`}
                    value={formData.manager}
                    onChange={(e) => handleChange('manager', e.target.value)}
                    placeholder="e.g. Alex Rivera"
                  />
                  {formErrors.manager && <span className="form-error">{formErrors.manager}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dept-employees">Employee Count *</label>
                  <input
                    id="dept-employees"
                    type="number"
                    min="1"
                    className={`form-input ${formErrors.employees ? 'form-input--error' : ''}`}
                    value={formData.employees}
                    onChange={(e) => handleChange('employees', Number(e.target.value))}
                  />
                  {formErrors.employees && <span className="form-error">{formErrors.employees}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dept-desc">Description *</label>
                  <textarea
                    id="dept-desc"
                    className={`form-input ${formErrors.description ? 'form-input--error' : ''}`}
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide a brief description of the department's role..."
                  />
                  {formErrors.description && <span className="form-error">{formErrors.description}</span>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingDept ? 'Save Changes' : 'Create Department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              className="modal-backdrop"
              onClick={() => setDeleteTarget(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="modal modal--danger"
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="danger-icon-wrap">
                <div className="danger-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L2 24h24L14 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M14 10v6M14 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <h2 className="modal-title modal-title--center">Delete Department</h2>

              <p className="delete-message">
                Are you sure you want to delete department{' '}
                <strong className="delete-name">{deleteTarget.name}</strong>?
                <br />
                <span className="delete-sub">This action cannot be undone.</span>
              </p>

              <div className="modal-footer modal-footer--centered">
                <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete Dept</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {toast.type === 'success' && <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              {toast.type === 'info' && <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />}
            </svg>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Departments;
