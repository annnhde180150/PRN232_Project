'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { ChatUser, Conversation } from '../../types/chat';
import {
  ConversationItem,
  ChatWindow,
  NewChatModal
} from '../../components/chat';

export default function ChatPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const {
    conversations,
    activeConversation,
    loading,
    error,
    selectConversation,
    sendMessage,
    clearError,
    unreadCount
  } = useChat();

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Handle responsive design
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Handle conversation selection
  const handleConversationSelect = async (conversation: Conversation) => {
    await selectConversation(conversation);
    if (isMobileView) {
      setShowChatWindow(true);
    }
  };

  // Handle new chat with selected user
  const handleNewChatUser = async (user: ChatUser) => {
    // Create a temporary conversation object for new chat
    const newConversation: Conversation = {
      conversationId: `new_${user.userId || user.helperId}`,
      bookingId: null,
      participantUserId: user.userId || null,
      participantHelperId: user.helperId || null,
      participantName: user.fullName,
      participantProfilePicture: user.profilePictureUrl,
      participantType: user.userId ? 'User' : 'Helper',
      lastMessage: {
        chatId: 0,
        bookingId: null,
        senderUserId: null,
        senderHelperId: null,
        receiverUserId: user.userId || null,
        receiverHelperId: user.helperId || null,
        messageContent: '',
        timestamp: new Date().toISOString(),
        isReadByReceiver: true,
        readTimestamp: null,
        isModerated: false,
        moderatorAdminId: null,
        senderName: user.fullName,
        senderProfilePicture: user.profilePictureUrl,
        senderType: user.userId ? 'User' : 'Helper'
      },
      unreadCount: 0,
      lastActivity: new Date().toISOString()
    };

    await selectConversation(newConversation);
    if (isMobileView) {
      setShowChatWindow(true);
    }
  };

  // Handle mobile back to conversations list
  const handleBackToConversations = () => {
    setShowChatWindow(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile back button */}
            {isMobileView && showChatWindow && (
              <button
                onClick={handleBackToConversations}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <h1 className="text-xl font-semibold text-gray-900">
              💬 Tin nhắn
            </h1>
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold leading-none text-white bg-red-500">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {/* New chat button */}
          {(!isMobileView || !showChatWindow) && (
            <button
              onClick={() => setShowNewChatModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Cuộc trò chuyện mới
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations list */}
        <div className={`bg-white border-r border-gray-200 flex flex-col ${
          isMobileView ? (showChatWindow ? 'hidden' : 'w-full') : 'w-1/3'
        }`}>
          {/* Conversations header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Cuộc trò chuyện ({conversations.length})
            </h2>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 p-8">
                  <div className="text-4xl mb-4">💭</div>
                  <p className="text-lg font-medium mb-2">Chưa có cuộc trò chuyện nào</p>
                  <p className="text-sm mb-4">Bắt đầu cuộc trò chuyện đầu tiên của bạn</p>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo cuộc trò chuyện mới
                  </button>
                </div>
              </div>
            ) : (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.conversationId}
                  conversation={conversation}
                  isActive={activeConversation?.conversationId === conversation.conversationId}
                  onClick={() => handleConversationSelect(conversation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col ${
          isMobileView ? (showChatWindow ? 'w-full' : 'hidden') : 'w-2/3'
        }`}>
          {activeConversation ? (
            <ChatWindow conversation={activeConversation} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl font-medium mb-2">Chọn cuộc trò chuyện</p>
                <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New chat modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onUserSelect={handleNewChatUser}
      />
    </div>
  );
} 