'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Notification as Notify, NotificationState } from '../types/notification';
import { notificationAPI } from '../lib/notification-api';
import { useAuth } from './AuthContext';
import { useSignalR } from '../hooks/useSignalR';
import { SignalRNotification } from '../lib/signalr-service';

interface NotificationContextType extends NotificationState {
  refreshNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getNotificationIcon: (type: string) => string;
  getNotificationColor: (type: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, userType, isAuthenticated } = useAuth();
  const [notificationState, setNotificationState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  });

  // Real-time notification handler
  const handleRealTimeNotification = useCallback((signalRNotification: SignalRNotification) => {
    console.log('Received real-time notification:', signalRNotification);

    // Convert SignalR notification to our Notification type
    const notification: Notify = {
      notificationId: parseInt(signalRNotification.referenceId) || Date.now(),
      title: signalRNotification.title,
      message: signalRNotification.message,
      notificationType: signalRNotification.notificationType,
      isRead: false,
      creationTime: signalRNotification.timestamp || new Date().toISOString(),
      readTime: null,
      recipientUserId: userType === 'helper' ? user?.id : undefined,
      recipientHelperId: userType === 'helper' ? user?.id : undefined,
      referenceId: signalRNotification.referenceId,
      sentTime: signalRNotification.timestamp || new Date().toISOString(),
    };

    // Add notification to the list
    setNotificationState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1
    }));

    // Show browser notification if supported and permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(signalRNotification.title, {
        body: signalRNotification.message,
        icon: '/favicon.ico',
        tag: signalRNotification.referenceId
      });
    }
  }, [user, userType]);

  // SignalR integration
  const signalR = useSignalR({
    autoConnect: true,
    callbacks: {
      onNotification: handleRealTimeNotification,
      onConnected: (message) => {
        console.log('Notification SignalR connected:', message);
        // Refresh notifications when connected
        if (isAuthenticated) {
          refreshNotifications();
        }
      },
      onReconnected: () => {
        console.log('Notification SignalR reconnected');
        // Refresh notifications when reconnected
        if (isAuthenticated) {
          refreshNotifications();
        }
      },
      onError: (error) => {
        console.error('Notification SignalR error:', error);
        setNotificationState(prev => ({
          ...prev,
          error: `SignalR Error: ${error}`
        }));
      }
    }
  });

  // Function to fetch notifications
  const refreshNotifications = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    setNotificationState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let notificationsResponse;
      let countResponse;

      if (userType === 'user') {
        notificationsResponse = await notificationAPI.getUserNotifications(user.id);
        countResponse = await notificationAPI.getUserUnreadCount(user.id);
      } else if (userType === 'helper') {
        notificationsResponse = await notificationAPI.getHelperNotifications(user.id);
        countResponse = await notificationAPI.getHelperUnreadCount(user.id);
      } else {
        // Admin doesn't have notifications in the current API
        setNotificationState(prev => ({
          ...prev,
          loading: false,
          notifications: [],
          unreadCount: 0
        }));
        return;
      }

      if (notificationsResponse.success && countResponse.success) {
        setNotificationState(prev => ({
          ...prev,
          notifications: notificationsResponse.data,
          unreadCount: countResponse.data,
          loading: false,
        }));
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotificationState(prev => ({
        ...prev,
        loading: false,
        error: 'Không thể tải thông báo. Vui lòng thử lại.',
      }));
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuthenticated || !user || notificationState.unreadCount === 0) {
      return;
    }

    try {
      let response;

      if (userType === 'user') {
        response = await notificationAPI.markAllUserNotificationsRead(user.id);
      } else if (userType === 'helper') {
        response = await notificationAPI.markAllHelperNotificationsRead(user.id);
      } else {
        return;
      }

      if (response.success) {
        // Update local state
        setNotificationState(prev => ({
          ...prev,
          notifications: prev.notifications.map(notification => ({
            ...notification,
            isRead: true,
            readTime: new Date().toISOString(),
          })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'AccountRestoration':
        return '✅';
      case 'AccountSuspension':
        return '⚠️';
      case 'BookingCancelled':
        return '❌';
      case 'BookingUpdate':
        return '📝';
      case 'NewBooking':
        return '🆕';
      case 'PasswordChange':
        return '🔒';
      case 'ProfileUpdate':
        return '👤';
      case 'ApplicationStatus':
        return '📋';
      default:
        return '📢';
    }
  };

  // Helper function to get notification color based on type
  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'AccountRestoration':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'AccountSuspension':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'BookingCancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'BookingUpdate':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'NewBooking':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'PasswordChange':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ProfileUpdate':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'ApplicationStatus':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Load notifications when user changes or component mounts
  useEffect(() => {
    if (isAuthenticated && user && (userType === 'user' || userType === 'helper')) {
      refreshNotifications();
    } else {
      // Clear notifications if not authenticated or admin
      setNotificationState({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
      });
    }
  }, [isAuthenticated, user, userType]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  const value: NotificationContextType = {
    ...notificationState,
    refreshNotifications,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 