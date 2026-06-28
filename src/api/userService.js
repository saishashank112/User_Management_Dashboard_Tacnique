import axios from 'axios';
import { API_URL } from '../utils/constants';

/**
 * Fetch all users from JSONPlaceholder.
 */
export const getUsers = () => axios.get(API_URL);

/**
 * Create a new user (simulated — JSONPlaceholder returns 201 but doesn't persist).
 */
export const createUser = (user) => axios.post(API_URL, user);

/**
 * Update an existing user by ID.
 * If the user has a local ID (> 10) not present on the server, we simulate success
 * by redirecting the API call to /users/1 to avoid 404 errors, while returning the correct ID.
 */
export const updateUser = async (id, user) => {
  if (id > 10) {
    const response = await axios.put(`${API_URL}/1`, user);
    return { ...response, data: { ...user, id } };
  }
  return axios.put(`${API_URL}/${id}`, user);
};

/**
 * Delete a user by ID.
 * If the user has a local ID (> 10) not present on the server, we simulate success
 * by redirecting the API call to /users/1 to avoid 404 errors.
 */
export const deleteUser = async (id) => {
  if (id > 10) {
    return axios.delete(`${API_URL}/1`);
  }
  return axios.delete(`${API_URL}/${id}`);
};
