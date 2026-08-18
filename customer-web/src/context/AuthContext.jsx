import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api/auth';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('customer_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getApiBaseUrl()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole: 'customer' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setUser(data);
      localStorage.setItem('customer_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePermanentPassword = async (newPassword, confirmPassword, targetUserId) => {
    setLoading(true);
    setError(null);
    try {
      const activeUserId = targetUserId || user?._id;
      const response = await fetch(`${getApiBaseUrl()}/set-permanent-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          userId: activeUserId,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update permanent password');
      }

      const updatedUser = data.user || { ...user, isOneTimePassword: false };
      setUser(updatedUser);
      localStorage.setItem('customer_user', JSON.stringify(updatedUser));
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, phone, email, password, sponsorId, aadhaarNumber, selectedPackage, aadhaarPhoto, panPhoto, transactionPhoto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${getApiBaseUrl()}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, sponsorId, aadhaarNumber, selectedPackage, aadhaarPhoto, panPhoto, transactionPhoto }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Do NOT setUser or set localStorage because they are pending approval
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, updatePermanentPassword, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
