'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react';
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
import { useSignalR } from '../hooks/useSignalR';
import { SignalRNotification } from '../lib/signalr-service';

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

  // Real-time message handlers
  const handleRealTimeMessage = useCallback((message: ChatMessage) => {
    console.log('Received real-time message:', message);

    setChatState(prev => {
      const currentUserId = userType === 'user' ? (user as any)?.id : null;
      const currentHelperId = userType === 'helper' ? (user as any)?.id : null;

      console.log('Current user info:', {
        currentUserId,
        currentHelperId,
        userType,
        activeConversation: prev.activeConversation
      });

      console.log('Message info:', {
        senderUserId: message.senderUserId,
        senderHelperId: message.senderHelperId,
        receiverUserId: message.receiverUserId,
        receiverHelperId: message.receiverHelperId,
        bookingId: message.bookingId
      });

      // Check if current user is involved in this message
      const isCurrentUserInvolved = 
        (currentUserId && (message.senderUserId === currentUserId || message.receiverUserId === currentUserId)) ||
        (currentHelperId && (message.senderHelperId === currentHelperId || message.receiverHelperId === currentHelperId));

      // Update conversations list to reflect new message
      let updatedConversations = [...prev.conversations];
      let shouldUpdateConversations = false;

      if (isCurrentUserInvolved) {
        // Find conversation to update or create new one
        const conversationIndex = updatedConversations.findIndex(conv => {
          if (message.bookingId && conv.bookingId === message.bookingId) return true;
          if (conv.participantUserId && 
              (message.senderUserId === conv.participantUserId || message.receiverUserId === conv.participantUserId)) return true;
          if (conv.participantHelperId && 
              (message.senderHelperId === conv.participantHelperId || message.receiverHelperId === conv.participantHelperId)) return true;
          return false;
        });

        if (conversationIndex >= 0) {
          // Update existing conversation's last message
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: message,
            lastActivity: message.timestamp,
            unreadCount: message.senderUserId === currentUserId || message.senderHelperId === currentHelperId ? 
              updatedConversations[conversationIndex].unreadCount : 
              updatedConversations[conversationIndex].unreadCount + 1
          };
          shouldUpdateConversations = true;
        }
      }

      // Add message to current active conversation if it matches
      let updatedMessages = prev.messages;
      if (prev.activeConversation && isCurrentUserInvolved) {
        // Check if message belongs to current conversation
        const isForCurrentConversation = (
          // Same booking ID
          (prev.activeConversation.bookingId && message.bookingId && prev.activeConversation.bookingId === message.bookingId) ||
          // Same participant (User conversation)
          (prev.activeConversation.participantUserId && 
           (message.senderUserId === prev.activeConversation.participantUserId || 
            message.receiverUserId === prev.activeConversation.participantUserId)) ||
          // Same participant (Helper conversation)
          (prev.activeConversation.participantHelperId && 
           (message.senderHelperId === prev.activeConversation.participantHelperId || 
            message.receiverHelperId === prev.activeConversation.participantHelperId))
        );

        console.log('Conversation check:', {
          isCurrentUserInvolved,
          isForCurrentConversation
        });

        if (isForCurrentConversation) {
          // Check for duplicates with more robust checking
          const messageExists = prev.messages.some(m => 
            m.chatId === message.chatId || 
            (m.messageContent === message.messageContent && 
             m.timestamp === message.timestamp &&
             m.senderUserId === message.senderUserId &&
             m.senderHelperId === message.senderHelperId)
          );

          if (!messageExists) {
            console.log('Adding message to conversation');
            // Add message and sort by timestamp to maintain order
            updatedMessages = [...prev.messages, message].sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          } else {
            console.log('Message already exists, skipping duplicate');
          }
        } else {
          console.log('Message not for current conversation');
        }
      } else {
        console.log('No active conversation or user not involved');
      }

      // Return updated state only if there are changes
      if (shouldUpdateConversations || updatedMessages !== prev.messages) {
        return {
          ...prev,
          conversations: shouldUpdateConversations ? updatedConversations : prev.conversations,
          messages: updatedMessages
        };
      }

      return prev;
    });

    // Only refresh unread count, don't reload entire conversations
    // refreshUnreadCount();
  }, [user, userType]);

  const handleRealTimeNotification = useCallback((notification: SignalRNotification) => {
    console.log('Received real-time notification:', notification);

    // Handle chat-related notifications
    if (notification.notificationType === 'ChatMessage') {
      // Refresh unread count for chat notifications
      // refreshUnreadCount();
    }
  }, []);

  const handleSignalRConnected = useCallback((message: string) => {
    console.log('Chat SignalR connected:', message);
    // Refresh data when connected
    if (isAuthenticated) {
      loadConversations();
      // refreshUnreadCount();
    }
  }, [isAuthenticated, loadConversations]);

  const handleSignalRError = useCallback((error: string) => {
    console.error('Chat SignalR error:', error);
    setChatState(prev => ({ ...prev, error: `SignalR Error: ${error}` }));
  }, []);

  // SignalR integration
  const signalR = useSignalR({
    autoConnect: true,
    callbacks: {
      onChatMessage: handleRealTimeMessage,
      onNotification: handleRealTimeNotification,
      onConnected: handleSignalRConnected,
      onReconnected: () => {
        console.log('Chat SignalR reconnected');
        // Rejoin active conversation if any
        if (chatState.activeConversation) {
          signalR.joinConversation(chatState.activeConversation.conversationId);
        }
        // Refresh data
        if (isAuthenticated) {
          loadConversations();
          // refreshUnreadCount();
        }
      },
      onError: handleSignalRError
    }
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



  // Select and load messages for a conversation
  const selectConversation = async (conversation: Conversation) => {
    // Leave previous conversation if any
    if (chatState.activeConversation && signalR.isConnected) {
      await signalR.leaveConversation(chatState.activeConversation.conversationId);
    }

    setChatState(prev => ({ ...prev, activeConversation: conversation }));

    // Join new conversation for real-time updates
    if (signalR.isConnected) {
      await signalR.joinConversation(conversation.conversationId);
    }

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
        // Add the new message to current messages and update conversation
        setChatState(prev => {
          // Update messages
          const updatedMessages = [...prev.messages, response.data];
          
          // Update conversations list to reflect the new last message
          const updatedConversations = prev.conversations.map(conv => {
            // Find the conversation that matches this message
            const isMatchingConversation = 
              (response.data.bookingId && conv.bookingId === response.data.bookingId) ||
              (conv.participantUserId && 
               (response.data.senderUserId === conv.participantUserId || response.data.receiverUserId === conv.participantUserId)) ||
              (conv.participantHelperId && 
               (response.data.senderHelperId === conv.participantHelperId || response.data.receiverHelperId === conv.participantHelperId));

            if (isMatchingConversation) {
              return {
                ...conv,
                lastMessage: response.data,
                lastActivity: response.data.timestamp
              };
            }
            return conv;
          });

          return {
            ...prev,
            messages: updatedMessages,
            conversations: updatedConversations,
            sending: false
          };
        });

        // Send message via SignalR for real-time update
        if (chatState.activeConversation && signalR.isConnected) {
          signalR.sendChatMessageToConversation(chatState.activeConversation.conversationId, response.data);
        }
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
      // await refreshUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark specific messages as read
  const markSpecificMessagesAsRead = async (chatIds: number[]) => {
    try {
      if (chatIds.length > 0) {
        await chatAPI.markAsRead(chatIds);

        setChatState(prev => {
          if (!prev.activeConversation) {
            return prev;
          }
          const updatedConversations = prev.conversations.map(conv => {
            if (conv.conversationId === prev.activeConversation?.conversationId) {
              return { ...conv, unreadCount: 0 };
            }
            return conv;
          });
          return { ...prev, conversations: updatedConversations };
        });

        // await refreshUnreadCount();
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
  const setActiveConversation = useCallback(async (conversation: Conversation | null) => {
    // Leave current conversation if any
    if (chatState.activeConversation && signalR.isConnected) {
      await signalR.leaveConversation(chatState.activeConversation.conversationId);
    }

    setChatState(prev => ({ ...prev, activeConversation: conversation }));

    // Join new conversation if provided
    if (conversation && signalR.isConnected) {
      await signalR.joinConversation(conversation.conversationId);
    }
  }, [chatState.activeConversation, signalR]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      // refreshUnreadCount();
    }
  }, [isAuthenticated]);

  // Auto-refresh unread count every 30 seconds (fallback for when SignalR is not connected)
  useEffect(() => {
    if (!isAuthenticated || signalR.isConnected) return;

    const interval = setInterval(() => {
      // refreshUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, signalR.isConnected]);

  // Cleanup SignalR connection when component unmounts or user logs out
  useEffect(() => {
    return () => {
      if (chatState.activeConversation && signalR.isConnected) {
        signalR.leaveConversation(chatState.activeConversation.conversationId);
      }
    };
  }, []);

  // Handle authentication changes
  useEffect(() => {
    if (!isAuthenticated && chatState.activeConversation && signalR.isConnected) {
      signalR.leaveConversation(chatState.activeConversation.conversationId);
      setChatState(prev => ({ ...prev, activeConversation: null }));
    }
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
