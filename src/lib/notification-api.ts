import axios from 'axios';
import { 
  NotificationResponse, 
  NotificationCountResponse, 
  MarkReadResponse 
} from '../types/notification';

// Base URL - using the same as main API
const BASE_URL = 'https://helper-finder.azurewebsites.net';

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

// Notification API functions
export const notificationAPI = {
  // User notification functions
  getUserNotifications: async (userId: number): Promise<NotificationResponse> => {
    const response = await api.get(`/api/Notification/user/${userId}`);
    return response.data;
  },

  getUserUnreadNotifications: async (userId: number): Promise<NotificationResponse> => {
    const response = await api.get(`/api/Notification/user/${userId}/unread`);
    return response.data;
  },

  getUserUnreadCount: async (userId: number): Promise<NotificationCountResponse> => {
    const response = await api.get(`/api/Notification/user/${userId}/unread-count`);
    return response.data;
  },

  markAllUserNotificationsRead: async (userId: number): Promise<MarkReadResponse> => {
    const response = await api.patch(`/api/Notification/user/${userId}/mark-all-read`);
    return response.data;
  },

  // Helper notification functions
  getHelperNotifications: async (helperId: number): Promise<NotificationResponse> => {
    const response = await api.get(`/api/Notification/helper/${helperId}`);
    return response.data;
  },

  getHelperUnreadNotifications: async (helperId: number): Promise<NotificationResponse> => {
    const response = await api.get(`/api/Notification/helper/${helperId}/unread`);
    return response.data;
  },

  getHelperUnreadCount: async (helperId: number): Promise<NotificationCountResponse> => {
    const response = await api.get(`/api/Notification/helper/${helperId}/unread-count`);
    return response.data;
  },

  markAllHelperNotificationsRead: async (helperId: number): Promise<MarkReadResponse> => {
    const response = await api.patch(`/api/Notification/helper/${helperId}/mark-all-read`);
    return response.data;
  },
}; 