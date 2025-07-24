import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '../../types/chat';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  conversation: Conversation;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { messages, loading, sending, sendMessage, markMessagesAsRead } = useChat();
  const { userType } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    markMessagesAsRead();
  }, [conversation, markMessagesAsRead]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || sending) return;

    const content = messageInput.trim();
    setMessageInput('');
    
    // Determine receiver based on conversation
    const receiverUserId = conversation.participantUserId || undefined;
    const receiverHelperId = conversation.participantHelperId || undefined;
    const bookingId = conversation.bookingId || undefined;

    await sendMessage(content, receiverUserId, receiverHelperId, bookingId);
    
    // Focus back to input
    inputRef.current?.focus();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          {conversation.participantProfilePicture ? (
            <img
              src={conversation.participantProfilePicture}
              alt={conversation.participantName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {conversation.participantName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Participant info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation.participantName}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>
                {conversation.participantType === 'Helper' ? '👨‍🔧 Người giúp việc' : '👤 Khách hàng'}
              </span>
              {conversation.bookingId && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">
                    📋 Booking #{conversation.bookingId}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium mb-2">Chưa có tin nhắn nào</p>
              <p className="text-sm">Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.chatId} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
              }}
              disabled={sending}
            />
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim() || sending}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
        
        {/* Typing indicator could go here */}
        <div className="mt-2 text-xs text-gray-500">
          Nhấn Enter để gửi, Shift + Enter để xuống dòng
        </div>
      </div>
    </div>
  );
}; 