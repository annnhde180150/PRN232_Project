// Notification Types
export interface Notification {
  notificationId: number;
  recipientUserId: number | undefined;
  recipientHelperId: number | undefined;
  title: string;
  message: string;
  notificationType: NotificationType | string;
  referenceId: string | null;
  isRead: boolean;
  readTime: string | null;
  creationTime: string;
  sentTime: string;
}

export type NotificationType =
  | 'AccountRestoration'
  | 'AccountSuspension'
  | 'BookingCancelled'
  | 'BookingUpdate'
  | 'NewBooking'
  | 'PasswordChange'
  | 'ProfileUpdate'
  | 'ApplicationStatus';

export interface NotificationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Notification[];
  timestamp: string;
  requestId: string;
}

export interface NotificationCountResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: number;
  timestamp: string;
  requestId: string;
}

export interface MarkReadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string;
  timestamp: string;
  requestId: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
} 