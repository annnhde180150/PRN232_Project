// Chat Types
export interface ChatMessage {
  chatId: number;
  bookingId: number | null;
  senderUserId: number | null;
  senderHelperId: number | null;
  receiverUserId: number | null;
  receiverHelperId: number | null;
  messageContent: string;
  timestamp: string;
  isReadByReceiver: boolean;
  readTimestamp: string | null;
  isModerated: boolean;
  moderatorAdminId: number | null;
  senderName: string;
  senderProfilePicture: string | null;
  senderType: 'User' | 'Helper';
}

export interface Conversation {
  conversationId: string;
  bookingId: number | null;
  participantUserId: number | null;
  participantHelperId: number | null;
  participantName: string;
  participantProfilePicture: string | null;
  participantType: 'User' | 'Helper';
  lastMessage: ChatMessage;
  unreadCount: number;
  lastActivity: string;
}

export interface ChatUser {
  userId?: number;
  helperId?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  isActive: boolean;
  lastLoginDate: string | null;
  hasExistingConversation: boolean;
  lastConversationDate: string | null;
  // Helper specific
  bio?: string;
  averageRating?: number;
  availableStatus?: number; // 0: Available, 1: Busy, 2: Offline
  skills?: string[];
}

export interface SearchUsersRequest {
  searchType: 'users' | 'helpers';
  searchTerm?: string;
  email?: string;
  isActive?: boolean;
  pageSize?: number;
  pageNumber?: number;
  availabilityStatus?: 'Available' | 'Busy' | 'Offline';
  minimumRating?: number;
}

export interface SearchUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: ChatUser[];
    helpers: ChatUser[];
    totalUsers: number;
    totalHelpers: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
  requestId: string;
}

export interface SendMessageRequest {
  messageContent: string;
  bookingId?: number;
  receiverUserId?: number;
  receiverHelperId?: number;
}

export interface ChatApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  unreadCount: number;
  loading: boolean;
  sending: boolean;
  error: string | null;
  searchResults: ChatUser[];
  searchLoading: boolean;
} 