import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';

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
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would make API call
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      const userSession = { ...foundUser };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasAccessToFirm = (firmId) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.firmAccess.includes(firmId);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    hasAccessToFirm
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
