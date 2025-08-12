// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user info on mount (e.g., via token-backed session)
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me'); // Adjust API endpoint as needed
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.response?.data?.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login function: send credentials to backend, save user on success
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setUser(response.data.user);
      setError(null);
      // Optionally, save token or user to localStorage/sessionStorage here
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function: call backend to logout, then clear user
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setError(null);
      // Optionally, remove token or user from localStorage/sessionStorage here
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return { user, login, logout, loading, error, fetchUser };
};

export default useAuth;
