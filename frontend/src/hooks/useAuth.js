// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current logged-in user info on mount
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(response.data.user);
      setError(null);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return { user, login, logout, loading, error, fetchUser };
};

export default useAuth;
