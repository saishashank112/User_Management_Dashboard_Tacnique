import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userService';
import { mapApiUser, generateId } from '../utils/helpers';

/**
 * Custom hook that encapsulates all user data fetching and CRUD operations.
 * Returns state and action callbacks to the consuming component.
 */
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const mapped = response.data.map(mapApiUser);
      setUsers(mapped);
    } catch (err) {
      setError(
        'Unable to fetch users from the API. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addUser = useCallback(
    async (newUserData) => {
      try {
        // JSONPlaceholder accepts POST and returns a simulated response
        await createUser(newUserData);
        const createdUser = {
          ...newUserData,
          id: generateId(users),
        };
        setUsers((prev) => [createdUser, ...prev]);
        return { success: true };
      } catch (err) {
        return { success: false, message: 'Failed to create user. Please try again.' };
      }
    },
    [users]
  );

  // ── Edit ──────────────────────────────────────────────────────────────────
  const editUser = useCallback(async (id, updatedData) => {
    try {
      await updateUser(id, updatedData);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to update user. Please try again.' };
    }
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const removeUser = useCallback(async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Failed to delete user. Please try again.' };
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
};

export default useUsers;
