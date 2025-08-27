
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch current user from backend
  const fetchMe = async () => {
    const { data } = await api.get("/auth/me"); // Authorization header handled by api.js
    return data;
  };

  // called after a successful login (with token from /auth/login)
  const login = async (token) => {
    localStorage.setItem("token", token);
    // set header for this and future requests
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (e) {
      // token invalid → clean up
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      setUser(null);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  // bootstrap on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // ensure header is present if page was refreshed
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
