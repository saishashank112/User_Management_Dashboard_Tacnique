/** Base URL for the JSONPlaceholder users API */
export const API_URL = 'https://jsonplaceholder.typicode.com/users';

/** Available departments for user assignment */
export const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'IT', 'Finance', 'Operations'];

/** Departments in the order they appear in filter dropdowns */
export const DEPARTMENT_OPTIONS = ['All', ...DEPARTMENTS];

/** Records-per-page options for the pagination control */
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

/** Default page size */
export const DEFAULT_PAGE_SIZE = 5;

/** Sortable column definitions */
export const SORT_FIELDS = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  department: 'department',
};
