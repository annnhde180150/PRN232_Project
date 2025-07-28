using AutoMapper;
using BussinessObjects.Models;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace Services.Implements;

public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;
    private readonly IMapper _mapper;
    private readonly IRealtimeNotificationService? _realtimeNotificationService;
    private readonly IUnitOfWork _unitOfWork;

    public NotificationService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<NotificationService> logger,
        IRealtimeNotificationService? realtimeNotificationService = null)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _realtimeNotificationService = realtimeNotificationService;
    }

    #region IBaseService Implementation

    public async Task<IEnumerable<NotificationDetailsDto>> GetAllAsync()
    {
        var notifications = await _unitOfWork.Notifications.GetAllAsync();
        return _mapper.Map<IEnumerable<NotificationDetailsDto>>(notifications);
    }


    public async Task<NotificationDetailsDto> GetByIdAsync(int id, bool asNoTracking = false)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null) throw new ArgumentException($"Notification with ID {id} not found");

        return _mapper.Map<NotificationDetailsDto>(notification);
    }

    public async Task<NotificationDetailsDto> CreateAsync(NotificationCreateDto createDto)
    {
        _logger.LogInformation($"Creating new notification with title: {createDto.Title}");

        // Validation
        if (createDto.RecipientUserId == null && createDto.RecipientHelperId == null)
            throw new ArgumentException("Notification must have either RecipientUserId or RecipientHelperId");

        if (createDto.RecipientUserId != null && createDto.RecipientHelperId != null)
            throw new ArgumentException("Notification cannot have both RecipientUserId and RecipientHelperId");

        var notification = _mapper.Map<Notification>(createDto);

        // Auto-set timestamps
        notification.CreationTime = DateTime.Now;
        notification.SentTime = DateTime.Now;
        notification.IsRead = false;

        await _unitOfWork.Notifications.AddAsync(notification);
        await _unitOfWork.CompleteAsync();

        var notificationDto = _mapper.Map<NotificationDetailsDto>(notification);

        // Gửi real-time notification nếu service được inject
        if (_realtimeNotificationService != null)
            try
            {
                string userId, userType;

                if (notification.RecipientUserId.HasValue)
                {
                    userId = notification.RecipientUserId.Value.ToString();
                    userType = "User";
                }
                else
                {
                    userId = notification.RecipientHelperId!.Value.ToString();
                    userType = "Helper";
                }

                await _realtimeNotificationService.SendToUserAsync(userId, userType, notificationDto);
                _logger.LogInformation($"Real-time notification sent to {userType} {userId}");
            }
            catch (Exception ex)
            {
                // Log error nhưng không throw để không ảnh hưởng đến flow chính
                _logger.LogError(ex, "Failed to send real-time notification, but notification was saved successfully");
            }

        return notificationDto;
    }

    public async Task<NotificationDetailsDto> CreateWithoutRealtimeAsync(NotificationCreateDto createDto)
    {
        _logger.LogInformation($"Creating new notification without real-time with title: {createDto.Title}");

        // Validation
        if (createDto.RecipientUserId == null && createDto.RecipientHelperId == null)
            throw new ArgumentException("Notification must have either RecipientUserId or RecipientHelperId");

        if (createDto.RecipientUserId != null && createDto.RecipientHelperId != null)
            throw new ArgumentException("Notification cannot have both RecipientUserId and RecipientHelperId");

        var notification = _mapper.Map<Notification>(createDto);

        // Auto-set timestamps
        notification.CreationTime = DateTime.Now;
        notification.SentTime = DateTime.Now;
        notification.IsRead = false;

        await _unitOfWork.Notifications.AddAsync(notification);
        await _unitOfWork.CompleteAsync();

        var notificationDto = _mapper.Map<NotificationDetailsDto>(notification);

        _logger.LogInformation($"Notification saved to database without real-time notification");
        return notificationDto;
    }

    public async Task<NotificationDetailsDto> UpdateAsync(int id, NotificationUpdateDto updateDto)
    {
        _logger.LogInformation($"Updating notification with ID: {id}");

        var existingNotification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (existingNotification == null) throw new ArgumentException($"Notification with ID {id} not found");

        // Map DTO to existing entity
        _mapper.Map(updateDto, existingNotification);

        _unitOfWork.Notifications.Update(existingNotification);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<NotificationDetailsDto>(existingNotification);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        return notification != null;
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting notification with ID: {id}");

        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null) throw new ArgumentException($"Notification with ID {id} not found");

        _unitOfWork.Notifications.Delete(notification);
        await _unitOfWork.CompleteAsync();
    }

    #endregion

    #region Notification Specific Methods

    public async Task<IEnumerable<NotificationDetailsDto>> GetByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Getting notifications for user ID: {userId}");
        var notifications = await _unitOfWork.Notifications.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<NotificationDetailsDto>>(notifications);
    }

    public async Task<IEnumerable<NotificationDetailsDto>> GetByHelperIdAsync(int helperId)
    {
        _logger.LogInformation($"Getting notifications for helper ID: {helperId}");
        var notifications = await _unitOfWork.Notifications.GetByHelperIdAsync(helperId);
        return _mapper.Map<IEnumerable<NotificationDetailsDto>>(notifications);
    }

    public async Task<IEnumerable<NotificationDetailsDto>> GetUnreadByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Getting unread notifications for user ID: {userId}");
        var notifications = await _unitOfWork.Notifications.GetUnreadByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<NotificationDetailsDto>>(notifications);
    }

    public async Task<IEnumerable<NotificationDetailsDto>> GetUnreadByHelperIdAsync(int helperId)
    {
        _logger.LogInformation($"Getting unread notifications for helper ID: {helperId}");
        var notifications = await _unitOfWork.Notifications.GetUnreadByHelperIdAsync(helperId);
        return _mapper.Map<IEnumerable<NotificationDetailsDto>>(notifications);
    }

    public async Task<int> GetUnreadCountByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Getting unread count for user ID: {userId}");
        return await _unitOfWork.Notifications.GetUnreadCountByUserIdAsync(userId);
    }

    public async Task<int> GetUnreadCountByHelperIdAsync(int helperId)
    {
        _logger.LogInformation($"Getting unread count for helper ID: {helperId}");
        return await _unitOfWork.Notifications.GetUnreadCountByHelperIdAsync(helperId);
    }

    public async Task<bool> MarkAsReadAsync(int id)
    {
        _logger.LogInformation($"Marking notification as read with ID: {id}");

        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null) return false;

        if (notification.IsRead == true)
        {
            _logger.LogInformation($"Notification with ID {id} is already marked as read");
            return true;
        }

        await _unitOfWork.Notifications.MarkAsReadAsync(id);
        await _unitOfWork.CompleteAsync();

        return true;
    }

    public async Task MarkAllAsReadByUserIdAsync(int userId)
    {
        _logger.LogInformation($"Marking all notifications as read for user ID: {userId}");
        await _unitOfWork.Notifications.MarkAllAsReadByUserIdAsync(userId);
        await _unitOfWork.CompleteAsync();
    }

    public async Task MarkAllAsReadByHelperIdAsync(int helperId)
    {
        _logger.LogInformation($"Marking all notifications as read for helper ID: {helperId}");
        await _unitOfWork.Notifications.MarkAllAsReadByHelperIdAsync(helperId);
        await _unitOfWork.CompleteAsync();
    }

    #endregion
}