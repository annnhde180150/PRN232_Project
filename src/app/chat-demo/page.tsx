'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useSignalR } from '../../hooks/useSignalR';
import { useAuth } from '../../contexts/AuthContext';

const ChatDemo: React.FC = () => {
    const { isAuthenticated, user, userType } = useAuth();
    const {
        conversations,
        activeConversation,
        messages,
        unreadCount,
        loading,
        sending,
        error,
        loadConversations,
        selectConversation,
        sendMessage,
        setActiveConversation
    } = useChat();

    const {
        notifications,
        unreadCount: notificationUnreadCount,
        refreshNotifications
    } = useNotifications();

    const signalR = useSignalR();

    const [messageInput, setMessageInput] = useState('');
    const [selectedReceiverId, setSelectedReceiverId] = useState<number | null>(null);
    const [receiverType, setReceiverType] = useState<'user' | 'helper'>('user');

    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
            refreshNotifications();
        }
    }, [isAuthenticated]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedReceiverId) return;

        const receiverUserId = receiverType === 'user' ? selectedReceiverId : undefined;
        const receiverHelperId = receiverType === 'helper' ? selectedReceiverId : undefined;

        await sendMessage(messageInput, receiverUserId, receiverHelperId);
        setMessageInput('');
    };

    const handleSelectConversation = async (conversation: any) => {
        await selectConversation(conversation);
    };

    if (!isAuthenticated) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Chat Demo</h1>
                <p className="text-red-600">Please login to use chat functionality.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Chat Demo - Real-time Messaging</h1>

            {/* SignalR Connection Status */}
            <div className="mb-6 p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-2">SignalR Connection Status</h2>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${signalR.isConnected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {signalR.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    <span className="text-sm text-gray-600">State: {signalR.connectionState}</span>
                    {signalR.error && (
                        <span className="text-sm text-red-600">Error: {signalR.error}</span>
                    )}
                </div>
                <div className="mt-2 flex gap-2">
                    <button
                        onClick={signalR.connect}
                        disabled={signalR.isConnected}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Connect
                    </button>
                    <button
                        onClick={signalR.disconnect}
                        disabled={!signalR.isConnected}
                        className="px-3 py-1 bg-red-500 text-white rounded disabled:bg-gray-300"
                    >
                        Disconnect
                    </button>
                    <button
                        onClick={signalR.refreshConnection}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                        Refresh
                    </button>
                    {signalR.error && (
                        <button
                            onClick={signalR.clearError}
                            className="px-3 py-1 bg-gray-500 text-white rounded"
                        >
                            Clear Error
                        </button>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-2">User Info</h2>
                <p>User: {user?.fullName || user?.email}</p>
                <p>Type: {userType}</p>
                <p>ID: {user?.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Conversations</h2>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                {unreadCount}
                            </span>
                        </div>

                        {loading && <p className="text-gray-500">Loading conversations...</p>}

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation.conversationId}
                                    onClick={() => handleSelectConversation(conversation)}
                                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${activeConversation?.conversationId === conversation.conversationId
                                            ? 'bg-blue-50 border-blue-300'
                                            : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{conversation.participantName}</p>
                                            <p className="text-sm text-gray-600">
                                                {conversation.participantType}
                                            </p>
                                            {conversation.lastMessage && (
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conversation.lastMessage.messageContent}
                                                </p>
                                            )}
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="lg:col-span-2">
                    <div className="border rounded-lg p-4 h-96 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {activeConversation
                                    ? `Chat with ${activeConversation.participantName}`
                                    : 'Select a conversation'
                                }
                            </h2>
                            {activeConversation && (
                                <button
                                    onClick={() => setActiveConversation(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Close
                                </button>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                            {loading && <p className="text-gray-500">Loading messages...</p>}

                            {messages.map((message) => {
                                const isOwnMessage =
                                    (userType === 'user' && message.senderUserId === user?.id) ||
                                    (userType === 'helper' && message.senderHelperId === user?.id);

                                return (
                                    <div
                                        key={message.chatId}
                                        className={`p-3 rounded-lg max-w-xs ${isOwnMessage
                                                ? 'bg-blue-500 text-white ml-auto'
                                                : 'bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm font-medium">{message.senderName}</p>
                                        <p>{message.messageContent}</p>
                                        <p className="text-xs opacity-75 mt-1">
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Send Message */}
                        {activeConversation && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !messageInput.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Send New Message */}
            <div className="mt-6 p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Send New Message</h2>
                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Receiver Type:</label>
                        <select
                            value={receiverType}
                            onChange={(e) => setReceiverType(e.target.value as 'user' | 'helper')}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="user">User</option>
                            <option value="helper">Helper</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Receiver ID:</label>
                        <input
                            type="number"
                            value={selectedReceiverId || ''}
                            onChange={(e) => setSelectedReceiverId(parseInt(e.target.value) || null)}
                            placeholder="Enter receiver ID"
                            className="px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || !selectedReceiverId}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300"
                    >
                        Send New Message
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="mt-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        {notificationUnreadCount}
                    </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-3 border rounded ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                                }`}
                        >
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(notification.createdTime).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ChatDemo;