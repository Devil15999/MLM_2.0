import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const getApiBaseUrl = () => {
  return 'http://localhost:5001/api/auth';
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('admin_user');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginAdmin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getApiBaseUrl()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole: 'admin' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Admin authentication failed');
      }

      setAdmin(data);
      localStorage.setItem('admin_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
  };

  const fetchRegisteredUsers = async () => {
    if (!admin?.token) return [];
    try {
      const res = await fetch(`${getApiBaseUrl()}/users`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch registered users:', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, error, loginAdmin, logoutAdmin, fetchRegisteredUsers, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};
