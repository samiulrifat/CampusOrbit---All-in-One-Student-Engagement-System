import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function PrivateRouter({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user?.role ? children : <Navigate to="/login" replace />;
}

export default PrivateRouter;