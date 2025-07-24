import React from 'react';
import { Conversation } from '../../types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick
}) => {
  // Format last activity time
  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.abs(now.getTime() - date.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  // Truncate message content
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {conversation.participantProfilePicture ? (
              <img
                src={conversation.participantProfilePicture}
                alt={conversation.participantName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {conversation.participantName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Conversation info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {conversation.participantName}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {formatLastActivity(conversation.lastActivity)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">
                  {conversation.participantType === 'Helper' ? '👨‍🔧' : '👤'}
                </span>
                <span className="text-xs text-gray-500">
                  {conversation.participantType === 'Helper' ? 'Người giúp việc' : 'Khách hàng'}
                </span>
              </div>
            </div>
            
            {/* Last message */}
            <div className="mt-1">
              <p className={`text-sm ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'} truncate`}>
                {conversation.lastMessage.senderName === conversation.participantName ? '' : 'Bạn: '}
                {truncateMessage(conversation.lastMessage.messageContent)}
              </p>
            </div>

            {/* Booking info */}
            {conversation.bookingId && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📋 Booking #{conversation.bookingId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Unread count */}
        {conversation.unreadCount > 0 && (
          <div className="flex-shrink-0 ml-2">
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold leading-none text-white bg-red-500 min-w-[20px] h-5">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 