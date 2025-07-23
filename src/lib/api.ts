import axios from 'axios';
import { 
  LoginRequest, 
  RegisterUserRequest, 
  RegisterHelperRequest, 
  AuthResponse, 
  User, 
  Helper, 
  Admin 
} from '../types/auth';

// Base URL - you should set this in environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7192';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API functions
export const authAPI = {
  // Login functions
  loginUser: async (credentials: LoginRequest): Promise<AuthResponse<User>> => {
    const response = await api.post('/api/Authentication/login/user', credentials);
    return response.data;
  },

  loginHelper: async (credentials: LoginRequest): Promise<AuthResponse<Helper>> => {
    const response = await api.post('/api/Authentication/login/helper', credentials);
    return response.data;
  },

  loginAdmin: async (credentials: LoginRequest): Promise<AuthResponse<Admin>> => {
    const response = await api.post('/api/Authentication/login/admin', credentials);
    return response.data;
  },

  // Registration functions
  registerUser: async (userData: RegisterUserRequest): Promise<AuthResponse<User>> => {
    const response = await api.post('/api/Authentication/register/user', userData);
    return response.data;
  },

  registerHelper: async (helperData: RegisterHelperRequest): Promise<AuthResponse<Helper>> => {
    const response = await api.post('/api/Authentication/register/helper', helperData);
    return response.data;
  },

  // Logout function
  logout: async (): Promise<AuthResponse<null>> => {
    const response = await api.post('/api/Authentication/logout');
    return response.data;
  },
};

// Auth utility functions
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  setUserData: (user: User | Helper | Admin, userType: 'user' | 'helper' | 'admin') => {
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user_type', userType);
  },

  getUserData: (): { user: User | Helper | Admin | null; userType: 'user' | 'helper' | 'admin' | null } => {
    const userData = localStorage.getItem('user_data');
    const userType = localStorage.getItem('user_type') as 'user' | 'helper' | 'admin' | null;
    return {
      user: userData ? JSON.parse(userData) : null,
      userType: userType,
    };
  },

  clearUserData: () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_type');
  },

  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    const userData = authUtils.getUserData();
    return !!(token && userData.user);
  },
}; 