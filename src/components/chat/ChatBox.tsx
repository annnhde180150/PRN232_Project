'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { ChatUser, Conversation } from '../../types/chat';
import {
    ConversationItem,
    ChatWindow,
    NewChatModal
} from './index';

interface ChatBoxProps {
    className?: string;
    position?: 'fixed' | 'relative';
    defaultOpen?: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
    className = '',
    position = 'fixed',
    defaultOpen = false
}) => {
    const { isAuthenticated, loading: authLoading } = useAuth();

    const {
        conversations,
        activeConversation,
        loading,
        error,
        selectConversation,
        clearError,
        unreadCount
    } = useChat();

    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [currentView, setCurrentView] = useState<'conversations' | 'chat'>('conversations');

    // Handle conversation selection
    const handleConversationSelect = async (conversation: Conversation) => {
        await selectConversation(conversation);
        setCurrentView('chat');
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
        setCurrentView('chat');
    };

    // Handle back to conversations
    const handleBackToConversations = () => {
        setCurrentView('conversations');
    };

    // Toggle chat box
    const toggleChatBox = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setCurrentView('conversations');
        }
    };

    if (!isAuthenticated || authLoading) {
        return null;
    }

    const positionClasses = position === 'fixed'
        ? 'fixed bottom-6 right-6 z-50'
        : 'relative';

    return (
        <div className={`${positionClasses} ${className}`}>
            {/* Chat toggle button (only for fixed position) */}
            {position === 'fixed' && !isOpen && (
                <button
                    onClick={toggleChatBox}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-5 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25 group"
                >
                    <div className="relative">
                        <svg className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {/* Unread count badge */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-3 -right-3 inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 min-w-[24px] h-6 shadow-lg animate-pulse">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                        {/* Pulse animation ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 animate-ping"></div>
                    </div>
                </button>
            )}

            {/* Chat box container */}
            {(isOpen || position === 'relative') && (
                <div className={`bg-white rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm transition-all duration-300 flex flex-col overflow-hidden ${position === 'fixed'
                    ? 'w-100 h-[600px] animate-in slide-in-from-bottom-4 fade-in-0 duration-300'
                    : 'w-full max-w-md h-[500px] mx-auto'
                    }`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white px-6 py-4 flex items-center justify-between relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>

                        <div className="flex items-center space-x-3 relative z-10">
                            {currentView === 'chat' && (
                                <button
                                    onClick={handleBackToConversations}
                                    className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 group"
                                >
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <h3 className="font-bold text-lg tracking-wide">
                                    {currentView === 'chat' && activeConversation
                                        ? activeConversation.participantName
                                        : 'Tin nhắn'
                                    }
                                </h3>
                            </div>

                            {currentView === 'conversations' && unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold leading-none text-blue-600 bg-white shadow-lg animate-bounce">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 relative z-10">
                            {currentView === 'conversations' && (
                                <button
                                    onClick={() => setShowNewChatModal(true)}
                                    className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 group"
                                    title="Cuộc trò chuyện mới"
                                >
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            )}

                            {position === 'fixed' && (
                                <button
                                    onClick={toggleChatBox}
                                    className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 group"
                                    title="Đóng"
                                >
                                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 text-sm animate-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                                <button
                                    onClick={clearError}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                        {currentView === 'conversations' ? (
                            <div className="h-full flex flex-col">
                                {/* Conversations list */}
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="relative">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ) : conversations.length === 0 ? (
                                        <div className="flex items-center justify-center h-full p-6">
                                            <div className="text-center text-gray-500 max-w-xs">
                                                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                    <div className="text-4xl">💭</div>
                                                </div>
                                                <h4 className="text-lg font-semibold mb-2 text-gray-700">Chưa có cuộc trò chuyện</h4>
                                                <p className="text-sm mb-6 text-gray-500 leading-relaxed">Bắt đầu cuộc trò chuyện đầu tiên của bạn và kết nối với mọi người</p>
                                                <button
                                                    onClick={() => setShowNewChatModal(true)}
                                                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Tạo cuộc trò chuyện mới
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-1">
                                            {conversations.map((conversation, index) => (
                                                <div
                                                    key={conversation.conversationId}
                                                    className="animate-in slide-in-from-left-4 fade-in-0 duration-300"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <ConversationItem
                                                        conversation={conversation}
                                                        isActive={activeConversation?.conversationId === conversation.conversationId}
                                                        onClick={() => handleConversationSelect(conversation)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full">
                                {activeConversation ? (
                                    <ChatWindow conversation={activeConversation} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                <div className="text-3xl">💬</div>
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-700">Chọn cuộc trò chuyện</h4>
                                            <p className="text-sm text-gray-500 mt-1">Bắt đầu trò chuyện với ai đó</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* New chat modal */}
            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                onUserSelect={handleNewChatUser}
            />
        </div>
    );
};