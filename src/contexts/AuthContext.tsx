'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, Helper, Admin } from '../types/auth';
import { authUtils } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User | Helper | Admin, userType: 'user' | 'helper' | 'admin') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    userType: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = authUtils.getToken();
    const { user, userType } = authUtils.getUserData();

    if (token && user && userType) {
      setAuthState({
        isAuthenticated: true,
        token,
        user,
        userType,
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User | Helper | Admin, userType: 'user' | 'helper' | 'admin') => {
    authUtils.setToken(token);
    authUtils.setUserData(user, userType);
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      userType,
    });
  };

  const logout = () => {
    authUtils.removeToken();
    authUtils.clearUserData();
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      userType: null,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 