'use client';

import React from 'react';
import { Notification } from '../../types/notification';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { getNotificationIcon, getNotificationColor } = useNotifications();

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const notificationTime = new Date(dateString);
    const diffInMs = now.getTime() - notificationTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return notificationTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Get Vietnamese notification type name
  const getNotificationTypeName = (type: string): string => {
    switch (type) {
      case 'AccountRestoration':
        return 'Khôi phục tài khoản';
      case 'AccountSuspension':
        return 'Tạm khóa tài khoản';
      case 'BookingCancelled':
        return 'Hủy đặt dịch vụ';
      case 'BookingUpdate':
        return 'Cập nhật đặt dịch vụ';
      case 'NewBooking':
        return 'Đặt dịch vụ mới';
      case 'PasswordChange':
        return 'Thay đổi mật khẩu';
      case 'ProfileUpdate':
        return 'Cập nhật hồ sơ';
      case 'ApplicationStatus':
        return 'Trạng thái đơn ứng tuyển';
      default:
        return 'Thông báo';
    }
  };

  const colorClasses = getNotificationColor(notification.notificationType);
  const icon = getNotificationIcon(notification.notificationType);

  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${colorClasses}`}>
          <span className="text-lg">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getNotificationTypeName(notification.notificationType)}
              </p>
            </div>
            
            {/* Time and Unread Indicator */}
            <div className="flex items-center space-x-2 ml-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatTimeAgo(notification.creationTime)}
              </span>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </div>

          {/* Message */}
          <p className={`text-sm mt-2 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
            {notification.message}
          </p>

          {/* Reference ID (if available) */}
          {notification.referenceId && (
            <p className="text-xs text-gray-400 mt-1">
              Mã tham chiếu: {notification.referenceId}
            </p>
          )}

          {/* Read Time (if read) */}
          {notification.isRead && notification.readTime && (
            <p className="text-xs text-gray-400 mt-1">
              Đã đọc lúc: {new Date(notification.readTime).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem; 