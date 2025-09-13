import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { usersAPI } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setUser(user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register({ name, email, password });
      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setUser(user);
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const becomeSeller = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.becomeSeller();
      const updatedUser = res.data.user;
      // merge into current user state (keep token etc.)
      setUser(prev => ({ ...prev, role: updatedUser.role }));
      toast.success('You are now a seller!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to become seller';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    becomeSeller,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};