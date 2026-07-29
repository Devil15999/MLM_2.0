import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};
