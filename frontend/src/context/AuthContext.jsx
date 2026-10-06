import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('bnb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getMe();
      const u = data.data;
      // Normalize shape: login/register return { id, name, email, role, ... },
      // but /auth/me returns the raw Mongoose doc (_id only). Keep both in sync
      // so components can safely read user.id regardless of how the session started.
      setUser({ ...u, id: u.id || u._id });
    } catch (err) {
      localStorage.removeItem('bnb_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem('bnb_token', data.token);
    setUser(data.user);
    toast.success(data.message || 'Welcome back!');
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    localStorage.setItem('bnb_token', data.token);
    setUser(data.user);
    toast.success(data.message || 'Account created successfully!');
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem('bnb_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUserLocal = (patch) => {
    // patch may come from an endpoint returning the raw Mongoose doc (_id only);
    // preserve the normalized `id` field so downstream components don't break.
    setUser((prev) => ({ ...prev, ...patch, id: prev.id || patch.id || patch._id }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLocal, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
