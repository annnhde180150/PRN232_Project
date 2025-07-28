using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Chat;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace Services.Implements;

public class ChatService : IChatService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<ChatService> _logger;
    private readonly IRealtimeNotificationService? _realtimeNotificationService;
    private readonly INotificationService? _notificationService;

    public ChatService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<ChatService> logger,
        IRealtimeNotificationService? realtimeNotificationService = null,
        INotificationService? notificationService = null)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _realtimeNotificationService = realtimeNotificationService;
        _notificationService = notificationService;
    }

    public async Task<ChatMessageDto> SendMessageAsync(SendMessageDto sendMessageDto, int? currentUserId, int? currentHelperId)
    {
        _logger.LogInformation($"Sending message from User:{currentUserId} Helper:{currentHelperId}");

        // Validation
        if (currentUserId == null && currentHelperId == null)
            throw new ArgumentException("Either currentUserId or currentHelperId must be provided");

        if (sendMessageDto.ReceiverUserId == null && sendMessageDto.ReceiverHelperId == null)
            throw new ArgumentException("Either ReceiverUserId or ReceiverHelperId must be provided");

        if (string.IsNullOrWhiteSpace(sendMessageDto.MessageContent))
            throw new ArgumentException("Message content cannot be empty");

        // Create chat message
        var chat = new Chat
        {
            BookingId = sendMessageDto.BookingId,
            SenderUserId = currentUserId,
            SenderHelperId = currentHelperId,
            ReceiverUserId = sendMessageDto.ReceiverUserId,
            ReceiverHelperId = sendMessageDto.ReceiverHelperId,
            MessageContent = sendMessageDto.MessageContent.Trim(),
            Timestamp = DateTime.Now,
            IsReadByReceiver = false,
            IsModerated = false
        };

        await _unitOfWork.Chats.AddAsync(chat);
        await _unitOfWork.CompleteAsync();

        // Get the complete message with navigation properties
        var savedMessage = await _unitOfWork.Chats.GetByLongIdAsync(chat.ChatId);
        var messageDto = _mapper.Map<ChatMessageDto>(savedMessage);

        // Send real-time notification and save to database
        if (_realtimeNotificationService != null || _notificationService != null)
        {
            try
            {
                string receiverId, receiverType;
                int? recipientUserId = null, recipientHelperId = null;

                if (sendMessageDto.ReceiverUserId.HasValue)
                {
                    receiverId = sendMessageDto.ReceiverUserId.Value.ToString();
                    receiverType = "User";
                    recipientUserId = sendMessageDto.ReceiverUserId.Value;
                }
                else
                {
                    receiverId = sendMessageDto.ReceiverHelperId!.Value.ToString();
                    receiverType = "Helper";
                    recipientHelperId = sendMessageDto.ReceiverHelperId.Value;
                }

                var notificationDto = new NotificationDetailsDto
                {
                    Title = "New Message",
                    Message = $"You have a new message from {messageDto.SenderName}",
                    NotificationType = "ChatMessage",
                    ReferenceId = chat.ChatId.ToString()
                };

                // Send real-time notification via SignalR
                if (_realtimeNotificationService != null)
                {
                    await _realtimeNotificationService.SendToUserAsync(receiverId, receiverType, notificationDto);

                    // Send the actual chat message via SignalR
                    await _realtimeNotificationService.SendChatMessageAsync(receiverId, receiverType, messageDto);
                }

                // Save notification to database for offline users (without sending real-time again)
                if (_notificationService != null)
                {
                    var createNotificationDto = new NotificationCreateDto
                    {
                        RecipientUserId = recipientUserId,
                        RecipientHelperId = recipientHelperId,
                        Title = notificationDto.Title,
                        Message = notificationDto.Message,
                        NotificationType = notificationDto.NotificationType,
                        ReferenceId = notificationDto.ReferenceId
                    };

                    await _notificationService.CreateWithoutRealtimeAsync(createNotificationDto);
                }

                _logger.LogInformation($"Chat message and notification sent to {receiverType} {receiverId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send real-time chat message");
            }
        }

        return messageDto;
    }

    public async Task<IEnumerable<ChatMessageDto>> GetConversationMessagesAsync(int? bookingId, int? userId, int? helperId, int? otherUserId, int? otherHelperId)
    {
        _logger.LogInformation($"Getting conversation messages - Booking:{bookingId}, User:{userId}, Helper:{helperId}, OtherUser:{otherUserId}, OtherHelper:{otherHelperId}");

        var messages = await _unitOfWork.Chats.GetConversationMessagesAsync(bookingId, userId, helperId, otherUserId, otherHelperId);
        return _mapper.Map<IEnumerable<ChatMessageDto>>(messages);
    }

    public async Task<IEnumerable<ChatConversationDto>> GetUserConversationsAsync(int userId)
    {
        _logger.LogInformation($"Getting conversations for user {userId}");

        var allMessages = await _unitOfWork.Chats.GetUserConversationsAsync(userId);
        return await BuildConversationsFromMessages(allMessages, userId, null);
    }

    public async Task<IEnumerable<ChatConversationDto>> GetHelperConversationsAsync(int helperId)
    {
        _logger.LogInformation($"Getting conversations for helper {helperId}");

        var allMessages = await _unitOfWork.Chats.GetHelperConversationsAsync(helperId);
        return await BuildConversationsFromMessages(allMessages, null, helperId);
    }

    public async Task<IEnumerable<ChatMessageDto>> GetUnreadMessagesAsync(int? userId, int? helperId)
    {
        _logger.LogInformation($"Getting unread messages for User:{userId} Helper:{helperId}");

        var messages = await _unitOfWork.Chats.GetUnreadMessagesAsync(userId, helperId);
        return _mapper.Map<IEnumerable<ChatMessageDto>>(messages);
    }

    public async Task<int> GetUnreadCountAsync(int? userId, int? helperId)
    {
        _logger.LogInformation($"Getting unread count for User:{userId} Helper:{helperId}");

        return await _unitOfWork.Chats.GetUnreadCountAsync(userId, helperId);
    }

    public async Task<bool> MarkMessagesAsReadAsync(MarkAsReadDto markAsReadDto, int? currentUserId, int? currentHelperId)
    {
        _logger.LogInformation($"Marking {markAsReadDto.ChatIds.Count} messages as read for User:{currentUserId} Helper:{currentHelperId}");

        if (!markAsReadDto.ChatIds.Any())
            return false;

        await _unitOfWork.Chats.MarkMessagesAsReadAsync(markAsReadDto.ChatIds, currentUserId, currentHelperId);
        await _unitOfWork.CompleteAsync();

        // Send real-time notification about read status
        if (_realtimeNotificationService != null)
        {
            try
            {
                string userId, userType;
                if (currentUserId.HasValue)
                {
                    userId = currentUserId.Value.ToString();
                    userType = "User";
                }
                else
                {
                    userId = currentHelperId!.Value.ToString();
                    userType = "Helper";
                }

                await _realtimeNotificationService.SendReadStatusAsync(userId, userType, markAsReadDto.ChatIds);
                _logger.LogInformation($"Read status sent to {userType} {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send real-time read status");
            }
        }

        return true;
    }

    public async Task<IEnumerable<ChatMessageDto>> GetBookingChatAsync(int bookingId)
    {
        _logger.LogInformation($"Getting chat messages for booking {bookingId}");

        var messages = await _unitOfWork.Chats.GetBookingChatAsync(bookingId);
        return _mapper.Map<IEnumerable<ChatMessageDto>>(messages);
    }

    private async Task<IEnumerable<ChatConversationDto>> BuildConversationsFromMessages(IEnumerable<Chat> allMessages, int? currentUserId, int? currentHelperId)
    {
        var conversations = new List<ChatConversationDto>();
        var processedConversations = new HashSet<string>();

        foreach (var message in allMessages)
        {
            string conversationKey = GenerateConversationKey(message, currentUserId, currentHelperId);
            
            if (processedConversations.Contains(conversationKey))
                continue;

            processedConversations.Add(conversationKey);

            var conversation = new ChatConversationDto
            {
                ConversationId = conversationKey,
                BookingId = message.BookingId,
                LastMessage = _mapper.Map<ChatMessageDto>(message),
                LastActivity = message.Timestamp
            };

            // Determine the other participant
            if (currentUserId.HasValue)
            {
                if (message.SenderUserId == currentUserId)
                {
                    // Current user is sender, other participant is receiver
                    conversation.ParticipantUserId = message.ReceiverUserId;
                    conversation.ParticipantHelperId = message.ReceiverHelperId;
                    conversation.ParticipantName = message.ReceiverUserId.HasValue ? 
                        message.ReceiverUser?.FullName : message.ReceiverHelper?.FullName;
                    conversation.ParticipantProfilePicture = message.ReceiverUserId.HasValue ? 
                        message.ReceiverUser?.ProfilePictureUrl : message.ReceiverHelper?.ProfilePictureUrl;
                    conversation.ParticipantType = message.ReceiverUserId.HasValue ? "User" : "Helper";
                }
                else
                {
                    // Current user is receiver, other participant is sender
                    conversation.ParticipantUserId = message.SenderUserId;
                    conversation.ParticipantHelperId = message.SenderHelperId;
                    conversation.ParticipantName = message.SenderUserId.HasValue ? 
                        message.SenderUser?.FullName : message.SenderHelper?.FullName;
                    conversation.ParticipantProfilePicture = message.SenderUserId.HasValue ? 
                        message.SenderUser?.ProfilePictureUrl : message.SenderHelper?.ProfilePictureUrl;
                    conversation.ParticipantType = message.SenderUserId.HasValue ? "User" : "Helper";
                }
            }
            else if (currentHelperId.HasValue)
            {
                if (message.SenderHelperId == currentHelperId)
                {
                    // Current helper is sender, other participant is receiver
                    conversation.ParticipantUserId = message.ReceiverUserId;
                    conversation.ParticipantHelperId = message.ReceiverHelperId;
                    conversation.ParticipantName = message.ReceiverUserId.HasValue ? 
                        message.ReceiverUser?.FullName : message.ReceiverHelper?.FullName;
                    conversation.ParticipantProfilePicture = message.ReceiverUserId.HasValue ? 
                        message.ReceiverUser?.ProfilePictureUrl : message.ReceiverHelper?.ProfilePictureUrl;
                    conversation.ParticipantType = message.ReceiverUserId.HasValue ? "User" : "Helper";
                }
                else
                {
                    // Current helper is receiver, other participant is sender
                    conversation.ParticipantUserId = message.SenderUserId;
                    conversation.ParticipantHelperId = message.SenderHelperId;
                    conversation.ParticipantName = message.SenderUserId.HasValue ? 
                        message.SenderUser?.FullName : message.SenderHelper?.FullName;
                    conversation.ParticipantProfilePicture = message.SenderUserId.HasValue ? 
                        message.SenderUser?.ProfilePictureUrl : message.SenderHelper?.ProfilePictureUrl;
                    conversation.ParticipantType = message.SenderUserId.HasValue ? "User" : "Helper";
                }
            }

            // Get unread count for this conversation
            conversation.UnreadCount = await _unitOfWork.Chats.GetUnreadCountForConversationAsync(
                conversation.BookingId, 
                currentUserId, 
                currentHelperId, 
                conversation.ParticipantUserId, 
                conversation.ParticipantHelperId);

            conversations.Add(conversation);
        }

        return conversations.OrderByDescending(c => c.LastActivity);
    }

    private string GenerateConversationKey(Chat message, int? currentUserId, int? currentHelperId)
    {
        var participants = new List<string>();

        if (currentUserId.HasValue)
        {
            participants.Add($"U{currentUserId}");
            if (message.SenderUserId == currentUserId)
            {
                if (message.ReceiverUserId.HasValue)
                    participants.Add($"U{message.ReceiverUserId}");
                else if (message.ReceiverHelperId.HasValue)
                    participants.Add($"H{message.ReceiverHelperId}");
            }
            else
            {
                if (message.SenderUserId.HasValue)
                    participants.Add($"U{message.SenderUserId}");
                else if (message.SenderHelperId.HasValue)
                    participants.Add($"H{message.SenderHelperId}");
            }
        }
        else if (currentHelperId.HasValue)
        {
            participants.Add($"H{currentHelperId}");
            if (message.SenderHelperId == currentHelperId)
            {
                if (message.ReceiverUserId.HasValue)
                    participants.Add($"U{message.ReceiverUserId}");
                else if (message.ReceiverHelperId.HasValue)
                    participants.Add($"H{message.ReceiverHelperId}");
            }
            else
            {
                if (message.SenderUserId.HasValue)
                    participants.Add($"U{message.SenderUserId}");
                else if (message.SenderHelperId.HasValue)
                    participants.Add($"H{message.SenderHelperId}");
            }
        }

        participants.Sort();
        var key = string.Join("_", participants);
        
        if (message.BookingId.HasValue)
            key += $"_B{message.BookingId}";

        return key;
    }


} 