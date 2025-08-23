import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user on mount, using stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data); // Must include user info with role!
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  // Expose user, setUser (for login/logout), and loading state
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
