import { DEPARTMENTS } from './constants';

/**
 * Maps a raw JSONPlaceholder user object to the dashboard's internal schema.
 * Assumption: `name` is split on the first space into firstName / lastName.
 * Assumption: `department` is assigned from DEPARTMENTS array based on user id (for variety).
 *
 * @param {Object} apiUser - Raw user object from the API
 * @returns {Object} Mapped user { id, firstName, lastName, email, department }
 */
export const mapApiUser = (apiUser) => {
  const parts = apiUser.name ? apiUser.name.split(' ') : ['', ''];
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  // Distribute departments across the 10 seeded API users for visual variety
  const department = DEPARTMENTS[(apiUser.id - 1) % DEPARTMENTS.length];

  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email || '',
    department,
  };
};

/**
 * Generates a new unique ID that is greater than all existing user IDs.
 * Used for locally-simulated POST responses.
 *
 * @param {Array} users - Current user list
 * @returns {number} New unique ID
 */
export const generateId = (users) => {
  if (!users || users.length === 0) return 1;
  return Math.max(...users.map((u) => u.id)) + 1;
};

/**
 * Returns a short display label for pagination.
 * e.g. "Showing 1–5 of 10 users"
 */
export const getPaginationLabel = (currentPage, pageSize, totalCount) => {
  if (totalCount === 0) return 'No users found';
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  return `Showing ${start}–${end} of ${totalCount} user${totalCount !== 1 ? 's' : ''}`;
};

/**
 * Calculates the total number of pages.
 */
export const getTotalPages = (totalCount, pageSize) =>
  Math.max(1, Math.ceil(totalCount / pageSize));
