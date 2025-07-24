import React from 'react';
import { ChatMessage } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user, userType } = useAuth();
  
  // Determine if this message is from current user
  const isFromCurrentUser = () => {
    if (userType === 'user') {
      return message.senderUserId === (user as any)?.id;
    } else if (userType === 'helper') {
      return message.senderHelperId === (user as any)?.id;
    }
    return false;
  };

  const isOwnMessage = isFromCurrentUser();
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Sender info for received messages */}
        {!isOwnMessage && (
          <div className="flex items-center mb-1">
            {message.senderProfilePicture ? (
              <img
                src={message.senderProfilePicture}
                alt={message.senderName}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <span className="text-xs text-gray-600">
                  {message.senderName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600 font-medium">
              {message.senderName}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              ({message.senderType === 'Helper' ? 'Người giúp việc' : 'Khách hàng'})
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.messageContent}
          </p>
        </div>
        
        {/* Message info */}
        <div className={`flex items-center mt-1 text-xs text-gray-500 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwnMessage && (
            <span className="ml-2">
              {message.isReadByReceiver ? (
                <span className="text-blue-500">✓✓</span>
              ) : (
                <span className="text-gray-400">✓</span>
              )}
            </span>
          )}
          {message.isModerated && (
            <span className="ml-2 text-orange-500 text-xs">
              📝 Đã kiểm duyệt
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 