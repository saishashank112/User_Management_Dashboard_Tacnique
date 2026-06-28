import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'users', path: '/', label: 'Users', icon: (
    <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )},
  { id: 'departments', path: '/departments', label: 'Departments', icon: (
    <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )},
];

const DashboardLayout = ({ onAddUserClick, onAddDeptClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  // Determine current page title/subtitle
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'User Management', subtitle: 'Manage and organize your organization users' };
      case '/departments':
        return { title: 'Departments', subtitle: 'Organize and manage your company divisions' };
      default:
        return { title: 'UserFlow', subtitle: 'Management Dashboard' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="app-container">
      {/* ── Left Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="white" />
              <circle cx="16" cy="12" r="5" fill="currentColor" />
              <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="sidebar-title">UserFlow</h1>
            <p className="sidebar-subtitle">Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              end={item.path === '/'}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profile Card */}
        <div className="sidebar-profile">
          <div className="profile-card" onClick={() => setProfileDropdownOpen((prev) => !prev)}>
            <div className="profile-avatar">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
                alt="Admin Avatar"
                className="user-avatar-img"
              />
            </div>
            <div className="profile-info">
              <span className="profile-name">Admin User</span>
              <span className="profile-email">admin@userflow.com</span>
            </div>
            <svg className="profile-caret" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <button className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                  Profile Settings
                </button>
                <button className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                  Organization
                </button>
                <button className="dropdown-item" onClick={() => {
                  setProfileDropdownOpen(false);
                  alert('Simulated Logout');
                }}>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div className="popup-backdrop" style={{ zIndex: 140 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <div className="main-layout">
        {/* Top Navbar */}
        <header className="top-nav">
          <div className="top-nav-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="top-nav-title-group">
              <h2 className="top-nav-title">{title}</h2>
              <span className="top-nav-subtitle">{subtitle}</span>
            </div>
          </div>

          <div className="top-nav-right">
            {/* Context-aware buttons */}
            {location.pathname === '/' && (
              <button
                id="add-user-btn"
                className="btn btn-primary"
                onClick={onAddUserClick}
                aria-label="Add new user"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Add User
              </button>
            )}

            {location.pathname === '/departments' && (
              <button
                id="add-dept-btn"
                className="btn btn-primary"
                onClick={onAddDeptClick}
                aria-label="Add new department"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Add Dept
              </button>
            )}

            <div className="top-nav-avatar">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
                alt="Admin Avatar"
                className="user-avatar-img"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
