import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUsers from '../hooks/useUsers';
import SearchBar from '../components/SearchBar';
import FilterPopup from '../components/FilterPopup';
import UserTable from '../components/UserTable';
import Pagination from '../components/Pagination';
import UserForm from '../components/UserForm';
import ConfirmDelete from '../components/ConfirmDelete';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

const EMPTY_FILTERS = {
  firstName: '',
  lastName: '',
  email: '',
  department: 'All',
};

const UsersPage = ({ addUserTrigger }) => {
  // ── Data layer ─────────────────────────────────────────────────────────────
  const { users, loading, error, addUser, editUser, removeUser, fetchUsers } = useUsers();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [filters, setFilters]               = useState(EMPTY_FILTERS);
  const [sortField, setSortField]           = useState('id');
  const [sortOrder, setSortOrder]           = useState('asc');
  const [currentPage, setCurrentPage]       = useState(1);
  const [pageSize, setPageSize]             = useState(DEFAULT_PAGE_SIZE);

  // Modal states
  const [showForm, setShowForm]             = useState(false);
  const [editingUser, setEditingUser]       = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Toast notifications
  const [toast, setToast]                   = useState(null);

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Trigger handler from Header ───────────────────────────────────────────
  useEffect(() => {
    if (addUserTrigger > 0) {
      setEditingUser(null);
      setShowForm(true);
    }
  }, [addUserTrigger]);

  // ── Derived data pipeline ──────────────────────────────────────────────────

  // 1. Search filter
  const searchedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // 2. Multi-field filter
  const filteredUsers = useMemo(() => {
    return searchedUsers.filter((u) => {
      const matchFirst =
        !filters.firstName ||
        u.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
      const matchLast =
        !filters.lastName ||
        u.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
      const matchEmail =
        !filters.email ||
        u.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchDept =
        filters.department === 'All' || u.department === filters.department;
      return matchFirst && matchLast && matchEmail && matchDept;
    });
  }, [searchedUsers, filters]);

  // 3. Sort
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const valA = String(a[sortField] ?? '').toLowerCase();
      const valB = String(b[sortField] ?? '').toLowerCase();
      if (sortField === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredUsers, sortField, sortOrder]);

  // 4. Paginate
  const totalCount = sortedUsers.length;
  const startIndex = (currentPage - 1) * pageSize;
  const visibleUsers = useMemo(
    () => sortedUsers.slice(startIndex, startIndex + pageSize),
    [sortedUsers, startIndex, pageSize]
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field, order) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    document.querySelector('.table-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleEditClick = useCallback((user) => {
    setEditingUser(user);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      if (editingUser) {
        const result = await editUser(editingUser.id, { ...editingUser, ...formData });
        if (result.success) showToast(`${formData.firstName} ${formData.lastName} updated successfully!`);
        return result;
      } else {
        const result = await addUser(formData);
        if (result.success) showToast(`${formData.firstName} ${formData.lastName} added successfully!`);
        return result;
      }
    },
    [editingUser, editUser, addUser, showToast]
  );

  const handleDeleteClick = useCallback((user) => {
    setDeleteTarget(user);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const name = `${deleteTarget.firstName} ${deleteTarget.lastName}`;
    const result = await removeUser(deleteTarget.id);
    setDeleteTarget(null);
    if (result.success) {
      showToast(`${name} deleted.`, 'info');
    } else {
      showToast(result.message, 'error');
    }
  }, [deleteTarget, removeUser, showToast]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.firstName) count++;
    if (filters.lastName) count++;
    if (filters.email) count++;
    if (filters.department !== 'All') count++;
    return count;
  }, [filters]);

  return (
    <motion.div
      className="main-content"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Controls row */}
      <div className="controls-section">
        <SearchBar value={searchQuery} onChange={handleSearch} />

        <div className="controls-buttons">
          <button
            id="filter-toggle-btn"
            className={`btn btn-secondary ${activeFilterCount > 0 ? 'btn-secondary--active' : ''}`}
            onClick={() => setShowFilterPopup(true)}
            aria-label="Open filters"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 3h14M4 8h8M7 13h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          <button
            id="refresh-btn"
            className="btn btn-secondary"
            onClick={fetchUsers}
            aria-label="Refresh user list"
            title="Refresh"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.65 2.35A8 8 0 1 0 15 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M15 2v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Results summary */}
      {!loading && (
        <div className="results-summary">
          <span className="results-count">
            {totalCount} user{totalCount !== 1 ? 's' : ''} found
          </span>
          {(searchQuery || activeFilterCount > 0) && (
            <button
              className="clear-all-btn"
              onClick={() => {
                setSearchQuery('');
                setFilters(EMPTY_FILTERS);
                setCurrentPage(1);
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Data table */}
      <div className="table-card">
        <UserTable
          users={visibleUsers}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Modals */}
      <AnimatePresence>
        {showFilterPopup && (
          <FilterPopup
            isOpen={showFilterPopup}
            onClose={() => setShowFilterPopup(false)}
            onApply={handleApplyFilters}
            activeFilters={filters}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <UserForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
            editingUser={editingUser}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDelete
            isOpen={Boolean(deleteTarget)}
            user={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast--${toast.type}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {toast.type === 'success' && (
                <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {toast.type === 'info' && (
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
              )}
              {toast.type === 'error' && (
                <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersPage;
