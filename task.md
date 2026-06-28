# User Management Dashboard — Tasks

## Phase 1 — Scaffolding
- [x] Run Vite scaffold command
- [x] Install axios
- [x] Clean boilerplate files

## Phase 2 — Utilities & API Layer
- [x] src/api/userService.js
- [x] src/utils/constants.js
- [x] src/utils/validators.js
- [x] src/utils/helpers.js
- [x] src/hooks/useUsers.js

## Phase 3 — Components
- [x] src/components/SearchBar.jsx
- [x] src/components/FilterPopup.jsx
- [x] src/components/UserTable.jsx
- [x] src/components/UserRow.jsx
- [x] src/components/Pagination.jsx
- [x] src/components/UserForm.jsx
- [x] src/components/ConfirmDelete.jsx

## Phase 4 — Routing & Subpages (Light Theme Redesign)
- [x] Installed `react-router-dom` and `recharts` dependencies
- [x] Created `src/layouts/DashboardLayout.jsx` layout wrapper
- [x] Removed notification bell icon and aligned top-right header elements
- [x] Created `src/pages/UsersPage.jsx` keeping the original CRUD list table intact
- [x] Created `src/pages/Departments.jsx` with full local CRUD capabilities
- [x] Removed unused Dashboard, Settings, Activity Logs, and Analytics pages per request

## Phase 5 — Documentation & Validation
- [x] README.md
- [x] Production build validation (npm run build succeeds in 442ms)
- [x] Walkthrough.md updated with redesign details
