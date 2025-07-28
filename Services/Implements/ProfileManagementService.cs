using AutoMapper;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Profile;
using Services.DTOs.Notification;
using Services.Interfaces;

namespace Services.Implements;

public class ProfileManagementService : IProfileManagementService
{
    private readonly ILogger<ProfileManagementService> _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRealtimeNotificationService _realtimeNotificationService;
    private readonly INotificationService? _notificationService;

    public ProfileManagementService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<ProfileManagementService> logger,
        IRealtimeNotificationService realtimeNotificationService,
        INotificationService? notificationService = null)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _realtimeNotificationService = realtimeNotificationService;
        _notificationService = notificationService;
    }

    public async Task<ProfileStatusDto> BanProfileAsync(BanProfileDto dto)
    {
        _logger.LogInformation($"Banning {dto.ProfileType} profile with ID: {dto.ProfileId}");

        if (dto.ProfileType.Equals("User", StringComparison.OrdinalIgnoreCase))
        {
            var user = await _unitOfWork.Users.GetByIdAsync(dto.ProfileId);
            if (user == null)
                throw new ArgumentException($"User with ID {dto.ProfileId} not found");

            user.IsActive = false;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            // Send real-time notification
            await SendBanNotificationAsync(dto.ProfileId, "User", user.FullName, dto.Reason);

            return new ProfileStatusDto
            {
                ProfileId = user.UserId,
                ProfileType = "User",
                FullName = user.FullName ?? "",
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                RegistrationDate = user.RegistrationDate,
                LastLoginDate = user.LastLoginDate
            };
        }
        else if (dto.ProfileType.Equals("Helper", StringComparison.OrdinalIgnoreCase))
        {
            var helper = await _unitOfWork.Helpers.GetByIdAsync(dto.ProfileId);
            if (helper == null)
                throw new ArgumentException($"Helper with ID {dto.ProfileId} not found");

            helper.IsActive = false;
            _unitOfWork.Helpers.Update(helper);
            await _unitOfWork.CompleteAsync();

            // Send real-time notification
            await SendBanNotificationAsync(dto.ProfileId, "Helper", helper.FullName, dto.Reason);

            return new ProfileStatusDto
            {
                ProfileId = helper.HelperId,
                ProfileType = "Helper",
                FullName = helper.FullName,
                Email = helper.Email,
                PhoneNumber = helper.PhoneNumber,
                IsActive = helper.IsActive,
                RegistrationDate = helper.RegistrationDate,
                LastLoginDate = helper.LastLoginDate
            };
        }
        else
        {
            throw new ArgumentException($"Invalid profile type: {dto.ProfileType}. Must be 'User' or 'Helper'");
        }
    }

    public async Task<ProfileStatusDto> UnbanProfileAsync(UnbanProfileDto dto)
    {
        _logger.LogInformation($"Unbanning {dto.ProfileType} profile with ID: {dto.ProfileId}");

        if (dto.ProfileType.Equals("User", StringComparison.OrdinalIgnoreCase))
        {
            var user = await _unitOfWork.Users.GetByIdAsync(dto.ProfileId);
            if (user == null)
                throw new ArgumentException($"User with ID {dto.ProfileId} not found");

            user.IsActive = true;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            // Send real-time notification
            await SendUnbanNotificationAsync(dto.ProfileId, "User", user.FullName, dto.Reason);

            return new ProfileStatusDto
            {
                ProfileId = user.UserId,
                ProfileType = "User",
                FullName = user.FullName ?? "",
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                RegistrationDate = user.RegistrationDate,
                LastLoginDate = user.LastLoginDate
            };
        }
        else if (dto.ProfileType.Equals("Helper", StringComparison.OrdinalIgnoreCase))
        {
            var helper = await _unitOfWork.Helpers.GetByIdAsync(dto.ProfileId);
            if (helper == null)
                throw new ArgumentException($"Helper with ID {dto.ProfileId} not found");

            helper.IsActive = true;
            _unitOfWork.Helpers.Update(helper);
            await _unitOfWork.CompleteAsync();

            // Send real-time notification
            await SendUnbanNotificationAsync(dto.ProfileId, "Helper", helper.FullName, dto.Reason);

            return new ProfileStatusDto
            {
                ProfileId = helper.HelperId,
                ProfileType = "Helper",
                FullName = helper.FullName,
                Email = helper.Email,
                PhoneNumber = helper.PhoneNumber,
                IsActive = helper.IsActive,
                RegistrationDate = helper.RegistrationDate,
                LastLoginDate = helper.LastLoginDate
            };
        }
        else
        {
            throw new ArgumentException($"Invalid profile type: {dto.ProfileType}. Must be 'User' or 'Helper'");
        }
    }

    public async Task<ProfileStatusDto?> GetProfileStatusAsync(int profileId, string profileType)
    {
        if (profileType.Equals("User", StringComparison.OrdinalIgnoreCase))
        {
            var user = await _unitOfWork.Users.GetByIdAsync(profileId);
            if (user == null) return null;

            return new ProfileStatusDto
            {
                ProfileId = user.UserId,
                ProfileType = "User",
                FullName = user.FullName ?? "",
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                RegistrationDate = user.RegistrationDate,
                LastLoginDate = user.LastLoginDate
            };
        }
        else if (profileType.Equals("Helper", StringComparison.OrdinalIgnoreCase))
        {
            var helper = await _unitOfWork.Helpers.GetByIdAsync(profileId);
            if (helper == null) return null;

            return new ProfileStatusDto
            {
                ProfileId = helper.HelperId,
                ProfileType = "Helper",
                FullName = helper.FullName,
                Email = helper.Email,
                PhoneNumber = helper.PhoneNumber,
                IsActive = helper.IsActive,
                RegistrationDate = helper.RegistrationDate,
                LastLoginDate = helper.LastLoginDate
            };
        }

        return null;
    }

    public async Task<IEnumerable<ProfileStatusDto>> GetBannedProfilesAsync()
    {
        var profiles = new List<ProfileStatusDto>();

        // Get banned users
        var bannedUsers = await _unitOfWork.Users.GetInactiveUsersAsync();
        var inactiveUsers = bannedUsers.Select(u => new ProfileStatusDto
        {
            ProfileId = u.UserId,
            ProfileType = "User",
            FullName = u.FullName ?? "",
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            IsActive = u.IsActive,
            RegistrationDate = u.RegistrationDate,
            LastLoginDate = u.LastLoginDate
        });

        profiles.AddRange(inactiveUsers);

        // Get banned helpers
        var bannedHelpers = await _unitOfWork.Helpers.GetInactiveHelpersAsync();
        var inactiveHelpers = bannedHelpers.Select(h => new ProfileStatusDto
        {
            ProfileId = h.HelperId,
            ProfileType = "Helper",
            FullName = h.FullName,
            Email = h.Email,
            PhoneNumber = h.PhoneNumber,
            IsActive = h.IsActive,
            RegistrationDate = h.RegistrationDate,
            LastLoginDate = h.LastLoginDate
        });

        profiles.AddRange(inactiveHelpers);

        return profiles;
    }

    public async Task<IEnumerable<ProfileStatusDto>> GetActiveProfilesAsync()
    {
        var profiles = new List<ProfileStatusDto>();

        // Get active users
        var activeUsers = await _unitOfWork.Users.GetActiveUsersAsync();
        var activeUserProfiles = activeUsers.Select(u => new ProfileStatusDto
        {
            ProfileId = u.UserId,
            ProfileType = "User",
            FullName = u.FullName ?? "",
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            IsActive = u.IsActive,
            RegistrationDate = u.RegistrationDate,
            LastLoginDate = u.LastLoginDate
        });

        profiles.AddRange(activeUserProfiles);

        // Get active helpers
        var activeHelpers = await _unitOfWork.Helpers.GetActiveHelpersAsync();
        var activeHelperProfiles = activeHelpers.Select(h => new ProfileStatusDto
        {
            ProfileId = h.HelperId,
            ProfileType = "Helper",
            FullName = h.FullName,
            Email = h.Email,
            PhoneNumber = h.PhoneNumber,
            IsActive = h.IsActive,
            RegistrationDate = h.RegistrationDate,
            LastLoginDate = h.LastLoginDate
        });

        profiles.AddRange(activeHelperProfiles);

        return profiles;
    }

    public async Task<bool> IsProfileBannedAsync(int profileId, string profileType)
    {
        var profile = await GetProfileStatusAsync(profileId, profileType);
        return profile?.IsActive == false;
    }

    private async Task SendBanNotificationAsync(int profileId, string profileType, string? fullName, string? reason)
    {
        try
        {
            var notification = new NotificationDetailsDto
            {
                RecipientUserId = profileType.Equals("User", StringComparison.OrdinalIgnoreCase) ? profileId : null,
                RecipientHelperId = profileType.Equals("Helper", StringComparison.OrdinalIgnoreCase) ? profileId : null,
                Title = "Account Suspended",
                Message = $"Your account has been suspended. {(string.IsNullOrEmpty(reason) ? "" : $"Reason: {reason}")}",
                NotificationType = "AccountSuspension",
                ReferenceId = $"{profileType}_{profileId}",
                IsRead = false,
                CreationTime = DateTime.Now
            };

            // Send real-time notification
            await _realtimeNotificationService.SendToUserAsync(
                profileId.ToString(),
                profileType,
                notification
            );

            // Save notification to database
            if (_notificationService != null)
            {
                var createNotificationDto = new NotificationCreateDto
                {
                    RecipientUserId = notification.RecipientUserId,
                    RecipientHelperId = notification.RecipientHelperId,
                    Title = notification.Title,
                    Message = notification.Message,
                    NotificationType = notification.NotificationType,
                    ReferenceId = notification.ReferenceId
                };

                await _notificationService.CreateWithoutRealtimeAsync(createNotificationDto);
            }

            _logger.LogInformation($"Ban notification sent to {profileType} {profileId} ({fullName})");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send ban notification to {profileType} {profileId}");
        }
    }

    private async Task SendUnbanNotificationAsync(int profileId, string profileType, string? fullName, string? reason)
    {
        try
        {
            var notification = new NotificationDetailsDto
            {
                RecipientUserId = profileType.Equals("User", StringComparison.OrdinalIgnoreCase) ? profileId : null,
                RecipientHelperId = profileType.Equals("Helper", StringComparison.OrdinalIgnoreCase) ? profileId : null,
                Title = "Account Restored",
                Message = $"Your account has been restored and is now active. {(string.IsNullOrEmpty(reason) ? "" : $"Note: {reason}")}",
                NotificationType = "AccountRestoration",
                ReferenceId = $"{profileType}_{profileId}",
                IsRead = false,
                CreationTime = DateTime.Now
            };

            // Send real-time notification
            await _realtimeNotificationService.SendToUserAsync(
                profileId.ToString(),
                profileType,
                notification
            );

            // Save notification to database
            if (_notificationService != null)
            {
                var createNotificationDto = new NotificationCreateDto
                {
                    RecipientUserId = notification.RecipientUserId,
                    RecipientHelperId = notification.RecipientHelperId,
                    Title = notification.Title,
                    Message = notification.Message,
                    NotificationType = notification.NotificationType,
                    ReferenceId = notification.ReferenceId
                };

                await _notificationService.CreateWithoutRealtimeAsync(createNotificationDto);
            }

            _logger.LogInformation($"Unban notification sent to {profileType} {profileId} ({fullName})");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send unban notification to {profileType} {profileId}");
        }
    }
}