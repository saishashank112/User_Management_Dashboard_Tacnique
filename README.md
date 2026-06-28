# UserFlow — User Management Dashboard

A modern, feature-rich admin dashboard for managing users, built with **React + Vite**. It integrates with the [JSONPlaceholder](https://jsonplaceholder.typicode.com) REST API and supports full CRUD operations, real-time search, multi-field filtering, bidirectional sorting, and responsive pagination.

---

## 📸 Features

| Feature | Description |
|---|---|
| 📋 **User Table** | Structured grid displaying ID, First Name, Last Name, Email, Department, and Actions |
| 🔍 **Real-time Search** | Instant filtering across First Name, Last Name, and Email |
| 🎛 **Filter Popup** | Multi-field panel to target specific cohorts by name, email, or department |
| ↕️ **Bidirectional Sorting** | Click any column header to sort A→Z or Z→A |
| 📄 **Pagination** | Configurable page sizes (5, 10, 25, 50) with smart page number display |
| ➕ **Add User** | Modal form with frontend validation to create new users |
| ✏️ **Edit User** | Pre-populated modal to update existing user records |
| 🗑 **Delete User** | Confirmation modal to prevent accidental deletions |
| 🔔 **Toast Notifications** | Success / info / error toasts after every CRUD action |
| ⚠️ **Error Handling** | Friendly error banners with a Retry button on API failures |
| ✅ **Form Validation** | Per-field inline errors with regex email verification |
| 📱 **Responsive Design** | Adapts cleanly to mobile (375px), tablet, and desktop (1440px) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd user-management-dashboard

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
user-management-dashboard/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── userService.js        # Axios wrappers for GET, POST, PUT, DELETE
│   │
│   ├── components/
│   │   ├── Header.jsx            # Sticky top bar with logo and Add User CTA
│   │   ├── SearchBar.jsx         # Real-time text search input
│   │   ├── FilterPopup.jsx       # Multi-field filter panel (modal)
│   │   ├── UserTable.jsx         # Data grid with sortable headers & skeleton loader
│   │   ├── UserRow.jsx           # Individual table row with edit/delete actions
│   │   ├── Pagination.jsx        # Page navigation and page-size controls
│   │   ├── UserForm.jsx          # Add/Edit user modal with validation
│   │   └── ConfirmDelete.jsx     # Delete safety confirmation modal
│   │
│   ├── hooks/
│   │   └── useUsers.js           # Custom hook for data fetching and CRUD operations
│   │
│   ├── utils/
│   │   ├── constants.js          # API URL, department list, pagination options
│   │   ├── validators.js         # Form validation — required fields + email regex
│   │   └── helpers.js            # Data mapping, ID generation, pagination math
│   │
│   ├── App.jsx                   # Root component — all shared state and derived data
│   ├── App.css                   # Complete dark-mode design system (CSS custom properties)
│   ├── index.css                 # Minimal global reset
│   └── main.jsx                  # React DOM entry point
│
├── index.html                    # HTML shell with SEO meta tags
└── README.md
```

---

## 📦 Libraries Used

| Library | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component library |
| **Vite** | 6.x | Build tool and dev server |
| **Axios** | 1.x | HTTP client for API requests |

> No UI frameworks (no Tailwind, Bootstrap, or MUI). All styling is vanilla CSS with custom properties.

---

## 🔌 API Integration

**Base URL:** `https://jsonplaceholder.typicode.com/users`

| Operation | Method | Endpoint | Local State Change |
|---|---|---|---|
| Fetch users | GET | `/users` | Populates user list on mount |
| Add user | POST | `/users` | Prepends new user to list |
| Edit user | PUT | `/users/:id` | Updates user in-place |
| Delete user | DELETE | `/users/:id` | Removes user from list |

> **Note:** JSONPlaceholder is a read-only mock API. POST/PUT/DELETE requests return simulated success responses (HTTP 200/201) but do not persist data. The UI state is updated locally to reflect the intended changes.

---

## ⚙️ Engineering Assumptions

### 1. Name Splitting
The JSONPlaceholder API returns a single `name` field (e.g. `"Leanne Graham"`). This is split on the first space:
- `firstName` = first word (e.g. `"Leanne"`)
- `lastName` = remaining words joined (e.g. `"Graham"`)

### 2. Department Assignment
The API has no `department` field. During the initial data fetch, departments are deterministically assigned from a predefined list (`Engineering`, `Marketing`, `Sales`, `HR`, `IT`, `Finance`, `Operations`) using modulo indexing on the user's `id`. This provides visual variety across the 10 seeded users.

### 3. Simulated POST IDs
JSONPlaceholder returns `id: 11` for all POST requests. To avoid duplicate key collisions, newly added users receive a locally-generated ID (`max existing ID + 1`).

---

## 🧗 Challenges & Solutions

| Challenge | Solution |
|---|---|
| JSONPlaceholder is read-only | Updated local React state optimistically after each API call to reflect changes in the UI |
| Name split edge cases | Used `split(' ')` with `slice(1).join(' ')` to handle multi-word last names (e.g. "Kurtis Weissnat") |
| Preventing accidental deletions | Added a dedicated `ConfirmDelete` modal that defaults focus to "Cancel" for safety |
| Responsive table on narrow screens | Wrapped table in `overflow-x: auto` container with `min-width` constraint on the table itself |

---

## 🔮 Future Improvements

- **Backend persistence** — Replace JSONPlaceholder with a real REST API backed by a database
- **Authentication** — Add JWT-based login for admin access control
- **Bulk actions** — Select multiple users for mass delete or department reassignment
- **Advanced sorting** — Multi-column sort with configurable priority
- **Export** — Download user list as CSV or Excel
- **Dark/Light mode toggle** — User-selectable theme preference persisted to `localStorage`
- **Unit tests** — Jest + React Testing Library for critical helpers and components
