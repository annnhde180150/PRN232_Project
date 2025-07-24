import axios from 'axios';
import {
  ChatMessage,
  Conversation,
  SendMessageRequest,
  SearchUsersRequest,
  SearchUsersResponse,
  ChatApiResponse
} from '../types/chat';

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

// Chat API functions
export const chatAPI = {
  // Send a new message
  sendMessage: async (message: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> => {
    const response = await api.post('/api/Chat/send', message);
    return response.data;
  },

  // Get conversation messages between users
  getConversation: async (
    bookingId?: number,
    otherUserId?: number,
    otherHelperId?: number
  ): Promise<ChatApiResponse<ChatMessage[]>> => {
    const params = new URLSearchParams();
    if (bookingId) params.append('bookingId', bookingId.toString());
    if (otherUserId) params.append('otherUserId', otherUserId.toString());
    if (otherHelperId) params.append('otherHelperId', otherHelperId.toString());
    
    const response = await api.get(`/api/Chat/conversation?${params.toString()}`);
    return response.data;
  },

  // Get all conversations for current user
  getConversations: async (): Promise<ChatApiResponse<Conversation[]>> => {
    const response = await api.get('/api/Chat/conversations');
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<ChatApiResponse<number>> => {
    const response = await api.get('/api/Chat/unread/count');
    return response.data;
  },

  // Get all unread messages
  getUnreadMessages: async (): Promise<ChatApiResponse<ChatMessage[]>> => {
    const response = await api.get('/api/Chat/unread');
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (): Promise<ChatApiResponse<{ message: string }>> => {
    const response = await api.post('/api/Chat/mark-as-read');
    return response.data;
  },

  // Get messages for specific booking
  getBookingMessages: async (bookingId: number): Promise<ChatApiResponse<ChatMessage[]>> => {
    const response = await api.get(`/api/Chat/booking/${bookingId}`);
    return response.data;
  },

  // Search users/helpers to start new chat
  searchUsers: async (searchRequest: SearchUsersRequest): Promise<SearchUsersResponse> => {
    const response = await api.post('/api/Chat/search', searchRequest);
    return response.data;
  },
}; 