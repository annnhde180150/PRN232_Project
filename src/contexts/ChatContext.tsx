'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  ChatState,
  ChatMessage,
  Conversation,
  ChatUser,
  SendMessageRequest,
  SearchUsersRequest
} from '../types/chat';
import { chatAPI } from '../lib/chat-api';
import { useAuth } from './AuthContext';

interface ChatContextType extends ChatState {
  // Conversation management
  loadConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => Promise<void>;
  loadMessages: (conversation: Conversation) => Promise<void>;
  
  // Message operations
  sendMessage: (content: string, receiverUserId?: number, receiverHelperId?: number, bookingId?: number) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  markSpecificMessagesAsRead: (chatIds: number[]) => Promise<void>;
  
  // Search functionality
  searchUsers: (request: SearchUsersRequest) => Promise<void>;
  clearSearchResults: () => void;
  
  // Real-time updates
  refreshUnreadCount: () => Promise<void>;
  
  // UI helpers
  clearError: () => void;
  setActiveConversation: (conversation: Conversation | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user, userType, isAuthenticated } = useAuth();
  
  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    sending: false,
    error: null,
    searchResults: [],
    searchLoading: false,
  });

  // Helper function to get current user ID
  const getCurrentUserId = () => {
    if (!user) return null;
    return userType === 'user' ? (user as any).id : null;
  };

  const getCurrentHelperId = () => {
    if (!user) return null;
    return userType === 'helper' ? (user as any).id : null;
  };

  // Load all conversations
  const loadConversations = async () => {
    if (!isAuthenticated) return;
    
    setChatState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await chatAPI.getConversations();
      if (response.success) {
        setChatState(prev => ({
          ...prev,
          conversations: response.data,
          loading: false
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách cuộc trò chuyện'
      }));
    }
  };

  // Select and load messages for a conversation
  const selectConversation = async (conversation: Conversation) => {
    setChatState(prev => ({ ...prev, activeConversation: conversation }));
    await loadMessages(conversation);
  };

  // Load messages for specific conversation
  const loadMessages = async (conversation: Conversation) => {
    setChatState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await chatAPI.getConversation(
        conversation.bookingId || undefined,
        conversation.participantUserId || undefined,
        conversation.participantHelperId || undefined
      );
      
      if (response.success) {
        setChatState(prev => ({
          ...prev,
          messages: response.data,
          loading: false
        }));

        // Mark unread messages in this conversation as read
        if (conversation.unreadCount > 0) {
          const currentUserId = getCurrentUserId();
          const currentHelperId = getCurrentHelperId();
          
          const unreadMessageIds = response.data
            .filter(msg => !msg.isReadByReceiver && 
              ((currentUserId && msg.receiverUserId === currentUserId) ||
               (currentHelperId && msg.receiverHelperId === currentHelperId)))
            .map(msg => msg.chatId);
          
          if (unreadMessageIds.length > 0) {
            await markSpecificMessagesAsRead(unreadMessageIds);
          }
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi khi tải tin nhắn'
      }));
    }
  };

  // Send a new message
  const sendMessage = async (
    content: string,
    receiverUserId?: number,
    receiverHelperId?: number,
    bookingId?: number
  ) => {
    if (!content.trim()) return;
    
    setChatState(prev => ({ ...prev, sending: true, error: null }));
    
    try {
      const messageRequest: SendMessageRequest = {
        messageContent: content.trim(),
        bookingId,
        receiverUserId,
        receiverHelperId
      };
      
      const response = await chatAPI.sendMessage(messageRequest);
      
      if (response.success) {
        // Add the new message to current messages
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, response.data],
          sending: false
        }));
        
        // Refresh conversations to update last message
        await loadConversations();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        sending: false,
        error: error instanceof Error ? error.message : 'Lỗi khi gửi tin nhắn'
      }));
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      // Get unread messages to extract their IDs
      const unreadResponse = await chatAPI.getUnreadMessages();
      if (unreadResponse.success && unreadResponse.data.length > 0) {
        const unreadChatIds = unreadResponse.data.map(message => message.chatId);
        await chatAPI.markAsRead(unreadChatIds);
      }
      await refreshUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark specific messages as read
  const markSpecificMessagesAsRead = async (chatIds: number[]) => {
    try {
      if (chatIds.length > 0) {
        await chatAPI.markAsRead(chatIds);
        await refreshUnreadCount();
      }
    } catch (error) {
      console.error('Error marking specific messages as read:', error);
    }
  };

  // Search users/helpers
  const searchUsers = async (request: SearchUsersRequest) => {
    setChatState(prev => ({ ...prev, searchLoading: true, error: null }));
    
    try {
      const response = await chatAPI.searchUsers(request);
      
      if (response.success) {
        const allUsers: ChatUser[] = [
          ...response.data.users.map(user => ({ ...user, userId: user.userId })),
          ...response.data.helpers.map(helper => ({ ...helper, helperId: helper.helperId }))
        ];
        
        setChatState(prev => ({
          ...prev,
          searchResults: allUsers,
          searchLoading: false
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        searchLoading: false,
        error: error instanceof Error ? error.message : 'Lỗi khi tìm kiếm người dùng'
      }));
    }
  };

  // Clear search results
  const clearSearchResults = useCallback(() => {
    setChatState(prev => ({ ...prev, searchResults: [] }));
  }, []);

  // Refresh unread count
  const refreshUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await chatAPI.getUnreadCount();
      if (response.success) {
        setChatState(prev => ({ ...prev, unreadCount: response.data }));
      }
    } catch (error) {
      console.error('Error refreshing unread count:', error);
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    setChatState(prev => ({ ...prev, error: null }));
  }, []);

  // Set active conversation
  const setActiveConversation = useCallback((conversation: Conversation | null) => {
    setChatState(prev => ({ ...prev, activeConversation: conversation }));
  }, []);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      refreshUnreadCount();
    }
  }, [isAuthenticated]);

  // Auto-refresh unread count every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: ChatContextType = {
    ...chatState,
    loadConversations,
    selectConversation,
    loadMessages,
    sendMessage,
    markMessagesAsRead,
    markSpecificMessagesAsRead,
    searchUsers,
    clearSearchResults,
    refreshUnreadCount,
    clearError,
    setActiveConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 