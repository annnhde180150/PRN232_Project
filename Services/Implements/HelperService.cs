using AutoMapper;
using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repositories;
using Services.DTOs.Helper;
using Services.DTOs.Admin;
using Services.DTOs.Notification;
using Services.DTOs.Chat;
using Services.Interfaces;

namespace Services.Implements;

public class HelperService : IHelperService
{
    private readonly ILogger<HelperService> _logger;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly INotificationService _notificationService;

    public HelperService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<HelperService> logger, IPasswordHasher passwordHasher, INotificationService notificationService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _passwordHasher = passwordHasher;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<HelperDetailsDto>> GetAllAsync()
    {
        var helpers = await _unitOfWork.Helpers.GetAllAsync();
        return _mapper.Map<IEnumerable<HelperDetailsDto>>(helpers);
    }

    public async Task<HelperDetailsDto> GetByIdAsync(int id, bool asNoTracking = false)
    {
        var helper = await _unitOfWork.Helpers.GetQueryable(
            h => h.HelperSkills,
            h => h.HelperWorkAreas,
            h => h.HelperDocuments
        ).FirstOrDefaultAsync(h => h.HelperId == id);
        
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto> CreateAsync(HelperCreateDto dto)
    {
        _logger.LogInformation($"Creating new helper with email: {dto.Email}");

        var helper = _mapper.Map<Helper>(dto);
        helper.RegistrationDate = DateTime.Now;
        helper.ApprovalStatus = "Pending";
        helper.IsActive = false; // Helpers start as inactive until approved

        await _unitOfWork.Helpers.AddAsync(helper);
        await _unitOfWork.CompleteAsync();

        if (dto.Skills != null && dto.Skills.Count > 0)
        {
            var skills = _mapper.Map<List<HelperSkill>>(dto.Skills);
            foreach (var skill in skills)
                skill.HelperId = helper.HelperId;
            await _unitOfWork.HelperSkills.AddRangeAsync(skills);
        }
        if (dto.WorkAreas != null && dto.WorkAreas.Count > 0)
        {
            var workAreas = _mapper.Map<List<HelperWorkArea>>(dto.WorkAreas);
            foreach (var wa in workAreas)
                wa.HelperId = helper.HelperId;
            await _unitOfWork.HelperWorkAreas.AddRangeAsync(workAreas);
        }
        if (dto.Documents != null && dto.Documents.Count > 0)
        {
            var documents = _mapper.Map<List<HelperDocument>>(dto.Documents);
            foreach (var doc in documents)
            {
                doc.HelperId = helper.HelperId;
                doc.UploadDate = DateTime.Now;
                doc.VerificationStatus = "Pending";
                doc.VerifiedByAdminId = null;
                doc.VerificationDate = null;
            }
            await _unitOfWork.HelperDocuments.AddRangeAsync(documents);
        }
        else
        {
            _logger.LogInformation($"No documents provided for helper {helper.HelperId}");
        }
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto> UpdateAsync(int id, HelperUpdateDto dto)
    {
        _logger.LogInformation($"Updating helper with ID: {id}");

        var existingHelper = await _unitOfWork.Helpers.GetByIdAsync(id);
        if (existingHelper == null) throw new ArgumentException($"Helper with ID {id} not found");

        _mapper.Map(dto, existingHelper);

        _unitOfWork.Helpers.Update(existingHelper);

        // Handle skills update
        if (dto.Skills != null)
        {
            // Remove existing skills
            var existingSkills = await _unitOfWork.HelperSkills.GetAllAsync();
            var skillsToRemove = existingSkills.Where(s => s.HelperId == id);
            foreach (var skill in skillsToRemove)
            {
                _unitOfWork.HelperSkills.Delete(skill);
            }

            // Add new skills
            if (dto.Skills.Count > 0)
            {
                var skills = _mapper.Map<List<HelperSkill>>(dto.Skills);
                foreach (var skill in skills)
                {
                    skill.HelperId = id;
                }
                await _unitOfWork.HelperSkills.AddRangeAsync(skills);
            }
        }

        // Handle work areas update
        if (dto.WorkAreas != null)
        {
            // Remove existing work areas
            var existingWorkAreas = await _unitOfWork.HelperWorkAreas.GetAllAsync();
            var workAreasToRemove = existingWorkAreas.Where(w => w.HelperId == id);
            foreach (var workArea in workAreasToRemove)
            {
                _unitOfWork.HelperWorkAreas.Delete(workArea);
            }

            // Add new work areas
            if (dto.WorkAreas.Count > 0)
            {
                var workAreas = _mapper.Map<List<HelperWorkArea>>(dto.WorkAreas);
                foreach (var workArea in workAreas)
                {
                    workArea.HelperId = id;
                }
                await _unitOfWork.HelperWorkAreas.AddRangeAsync(workAreas);
            }
        }

        // Handle documents update
        if (dto.Documents != null)
        {
            // Remove existing documents
            var existingDocuments = await _unitOfWork.HelperDocuments.GetAllAsync();
            var documentsToRemove = existingDocuments.Where(d => d.HelperId == id);
            foreach (var document in documentsToRemove)
            {
                _unitOfWork.HelperDocuments.Delete(document);
            }

            // Add new documents
            if (dto.Documents.Count > 0)
            {
                var documents = _mapper.Map<List<HelperDocument>>(dto.Documents);
                foreach (var document in documents)
                {
                    document.HelperId = id;
                    document.UploadDate = DateTime.Now;
                    document.VerificationStatus = "Pending";
                    document.VerifiedByAdminId = null;
                    document.VerificationDate = null;
                }
                await _unitOfWork.HelperDocuments.AddRangeAsync(documents);
            }
        }

        await _unitOfWork.CompleteAsync();

        return await GetByIdAsync(id);
    }
    public async Task<HelperDetailsDto?> ValidateHelperCredentialsAsync(string email, string password)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        if (helper == null) return null;

        if (!helper.IsActive == true) return null;

        if (!_passwordHasher.VerifyPassword(password, helper.PasswordHash!))
        {
            return null;
        }

        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task UpdateLastLoginDateAsync(int helperId)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        if (helper == null) throw new ArgumentException($"User with ID {helperId} not found");

        helper.LastLoginDate = DateTime.Now;
        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();
    }

    public async Task UpdateEmailVerificationStatusAsync(int helperId, bool isEmailVerified)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        if (helper == null) throw new ArgumentException($"Helper with ID {helperId} not found");

        helper.IsEmailVerified = isEmailVerified;
        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();
    }
    public async Task<bool> ExistsAsync(int id)
    {
        var helper = await _unitOfWork.Helpers.GetByIdAsync(id);
        return helper != null;
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation($"Deleting helper with ID: {id}");
        await _unitOfWork.Helpers.DeleteByIdAsync(id);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<HelperDetailsDto?> GetHelperByEmailAsync(string email)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<HelperDetailsDto?> GetHelperByPhoneAsync(string phoneNumber)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByPhoneAsync(phoneNumber);
        return _mapper.Map<HelperDetailsDto>(helper);
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        return helper != null;
    }

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
    {
        var helper = await _unitOfWork.Helpers.GetHelperByPhoneAsync(phoneNumber);
        return helper != null;
    }

    public async Task<int> GetAvailableHelper(ServiceRequest request)
    {
        var startTime = request.RequestedStartTime;
        //get list of helper(priority by rating and work hourse that day)
        var availableHelpers = _unitOfWork.Helpers.GetQueryable(h => h.ServiceRequests)
            .Where(h => h.IsActive.Value);
            //.Where(h => h.);

        //get free helpers based on requested time and duration
        availableHelpers = (IOrderedQueryable<Helper>)availableHelpers
            .AsParallel()
            .Where(h => !h.ServiceRequests.Any(sr =>
                sr.RequestedStartTime < startTime.AddHours((double)request.RequestedDurationHours.Value) &&
                sr.RequestedStartTime.AddMinutes((double)sr.RequestedDurationHours) > startTime));

        //filter by location if provided

        //filter by work hours that day
        availableHelpers = (IQueryable<Helper>)availableHelpers
            .AsParallel()
            .OrderBy(h => h.ServiceRequests.Where(r => r.RequestedStartTime.Date == startTime.Date).Sum(r => r.RequestedDurationHours))
            .ThenBy(h => h.AverageRating);

        //compare same helper (based on what constraint)
        return _mapper.Map<HelperDetailsDto>(availableHelpers.FirstOrDefault()).Id;
    }

    public async Task<bool> SetHelperStatusOnlineAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusOnlineAsync(helperId);
    }

    public async Task<bool> SetHelperStatusOfflineAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusOfflineAsync(helperId);
    }

    public async Task<bool> SetHelperStatusBusyAsync(int helperId)
    {
        return await _unitOfWork.Helpers.SetHelperStatusBusyAsync(helperId);
    }

    public async Task<HelperViewIncomeDto> HelperViewIncomeAsync(int helperId)
    {
        var helper = await _unitOfWork.Helpers.GetQueryable(h => h.HelperWallet).FirstOrDefaultAsync(h => h.HelperId == helperId);

        if (helper == null) throw new ArgumentException($"Helper with ID {helperId} not found");
        var income = helper.HelperWallet;
        return _mapper.Map<HelperViewIncomeDto>(income);
    }
    
    public async Task<bool> ChangePasswordAsync(int helperId, string currentPassword, string newPassword)
    {
        _logger.LogInformation($"Changing password for helper ID: {helperId}");

        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        if (helper == null)
        {
            _logger.LogWarning($"Helper with ID {helperId} not found");
            return false;
        }

        // Verify current password
        if (!_passwordHasher.VerifyPassword(currentPassword, helper.PasswordHash))
        {
            _logger.LogWarning($"Invalid current password for helper ID: {helperId}");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        helper.PasswordHash = newPasswordHash;

        // Update helper
        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password changed successfully for helper ID: {helperId}");
        return true;
    }


    // Admin helper application methods
    public async Task<(IEnumerable<HelperApplicationListDto> applications, int totalCount)> GetHelperApplicationsAsync(
        string? status = null,
        int page = 1,
        int pageSize = 20)
    {
        _logger.LogInformation($"Getting helper applications with status: {status}, page: {page}, pageSize: {pageSize}");

        var (helpers, totalCount) = await _unitOfWork.Helpers.GetHelperApplicationsAsync(status, page, pageSize);

        var applications = helpers.Select(h => new HelperApplicationListDto
        {
            HelperId = h.HelperId,
            FullName = h.FullName,
            Email = h.Email,
            PhoneNumber = h.PhoneNumber,
            RegistrationDate = h.RegistrationDate,
            ApprovalStatus = h.ApprovalStatus,
            DocumentCount = h.HelperDocuments?.Count ?? 0,
            SkillCount = h.HelperSkills?.Count ?? 0,
            WorkAreaCount = h.HelperWorkAreas?.Count ?? 0,
            PrimaryService = h.HelperSkills?.FirstOrDefault(s => s.IsPrimarySkill == true)?.Service?.ServiceName
        });

        return (applications, totalCount);
    }

    public async Task<HelperApplicationDetailsDto?> GetHelperApplicationByIdAsync(int helperId)
    {
        _logger.LogInformation($"Getting helper application details for ID: {helperId}");

        var helper = await _unitOfWork.Helpers.GetHelperApplicationByIdAsync(helperId);
        if (helper == null)
        {
            _logger.LogWarning($"Helper application with ID {helperId} not found");
            return null;
        }

        var detailsDto = _mapper.Map<HelperApplicationDetailsDto>(helper);

        // Calculate document statistics
        if (helper.HelperDocuments != null)
        {
            detailsDto.TotalDocuments = helper.HelperDocuments.Count;
            detailsDto.VerifiedDocuments = helper.HelperDocuments.Count(d => d.VerificationStatus == "Verified");
            detailsDto.PendingDocuments = helper.HelperDocuments.Count(d => d.VerificationStatus == "Pending");
        }

        return detailsDto;
    }

    public async Task<bool> ProcessHelperApplicationDecisionAsync(int helperId, HelperApplicationDecisionDto decision, int adminId)
    {
        _logger.LogInformation($"Processing helper application decision for ID: {helperId}, Status: {decision.Status}, Admin: {adminId}");

        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        if (helper == null)
        {
            _logger.LogWarning($"Helper with ID {helperId} not found");
            return false;
        }

        // Validate current status allows this transition
        if (helper.ApprovalStatus == "approved" && decision.Status != "rejected")
        {
            _logger.LogWarning($"Cannot change status from approved to {decision.Status} for helper {helperId}");
            return false;
        }

        // Update helper status
        var oldStatus = helper.ApprovalStatus;
        helper.ApprovalStatus = decision.Status;

        if (decision.Status == "approved")
        {
            helper.IsActive = true;
            helper.ApprovedByAdminId = adminId;
            helper.ApprovalDate = DateTime.Now;
        }
        else
        {
            helper.IsActive = false;
            if (decision.Status == "rejected")
            {
                helper.ApprovedByAdminId = adminId;
                helper.ApprovalDate = DateTime.Now;
            }
        }

        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();

        // Send notification to helper
        try
        {
            var notificationTitle = decision.Status switch
            {
                "approved" => "Application Approved",
                "rejected" => "Application Rejected",
                "revision_requested" => "Application Revision Required",
                _ => "Application Status Update"
            };

            var notificationMessage = decision.Status switch
            {
                "approved" => "Congratulations! Your helper application has been approved. You can now start accepting bookings.",
                "rejected" => $"Your helper application has been rejected. {(string.IsNullOrEmpty(decision.Comment) ? "" : $"Reason: {decision.Comment}")}",
                "revision_requested" => $"Your helper application requires revision. Please review and resubmit. {(string.IsNullOrEmpty(decision.Comment) ? "" : $"Details: {decision.Comment}")}",
                _ => "Your application status has been updated."
            };

            var notificationDto = new NotificationCreateDto
            {
                Title = notificationTitle,
                Message = notificationMessage,
                RecipientHelperId = helperId,
                NotificationType = "ApplicationStatus"
            };

            await _notificationService.CreateAsync(notificationDto);
            _logger.LogInformation($"Notification sent to helper {helperId} for status change to {decision.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send notification to helper {helperId}, but status was updated successfully");
        }

        _logger.LogInformation($"Helper application {helperId} status changed from {oldStatus} to {decision.Status} by admin {adminId}");
        return true;
    }

    public async Task<(IEnumerable<HelperSearchDto> helpers, int totalCount)> SearchHelpersForChatAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        string? availabilityStatus = null,
        decimal? minimumRating = null,
        int? excludeHelperId = null,
        int? currentUserId = null,
        int? currentHelperId = null,
        int page = 1,
        int pageSize = 20)
    {
        _logger.LogInformation($"Searching helpers for chat - SearchTerm: {searchTerm}, Email: {email}, IsActive: {isActive}");

        // Get helpers from repository
        var (helpers, totalCount) = await _unitOfWork.Helpers.SearchHelpersAsync(
            searchTerm, email, isActive, availabilityStatus, minimumRating, excludeHelperId, page, pageSize);

        // Map to search DTOs
        var helperSearchDtos = new List<HelperSearchDto>();

        foreach (var helper in helpers)
        {
            var helperDto = _mapper.Map<HelperSearchDto>(helper);

            // Check if there's an existing conversation
            if (currentUserId.HasValue || currentHelperId.HasValue)
            {
                helperDto.HasExistingConversation = await _unitOfWork.Chats.HasConversationBetweenUsersAsync(
                    currentUserId, currentHelperId, null, helper.HelperId);

                if (helperDto.HasExistingConversation)
                {
                    helperDto.LastConversationDate = await _unitOfWork.Chats.GetLastConversationDateAsync(
                        currentUserId, currentHelperId, null, helper.HelperId);
                }
            }

            helperSearchDtos.Add(helperDto);
        }

        return (helperSearchDtos, totalCount);
    }

    public async Task<List<Service>> GetHelperAvailableService(int helperId)
    {
        var helperRepo = _unitOfWork.Helpers;
        var helper = await helperRepo.GetQueryable(h => h.HelperSkills).Where(h => h.HelperId == helperId).FirstOrDefaultAsync();
        var serviceRepo = _unitOfWork.Services;
        var serviceList = new List<Service>();
        foreach(var skill in helper.HelperSkills)
        {
            var service = await serviceRepo.GetByIdAsync(skill.ServiceId);
            serviceList.Add(service);
        }

        return serviceList;
    }
    
    public async Task<IEnumerable<SearchHelperDto>> GetHelpersByServiceAsync(int serviceId, string? page, string? pageSize)
    {
        _logger.LogInformation($"Getting helpers for service ID: {serviceId}");
        var helpers = await _unitOfWork.Helpers.GetQueryable(h => h.HelperSkills)
            .Where(h => h.HelperSkills.Any(s => s.ServiceId == serviceId))
            .ToListAsync();
        var searchHelpers = new List<SearchHelperDto>();
        var service = await _unitOfWork.Services.GetByIdAsync(serviceId);
        foreach (var helper in helpers)
        {
            var helperWorkAreas = await _unitOfWork.HelperWorkAreas.GetAllAsync(h => h.HelperId == helper.HelperId);
            var rating = await _unitOfWork.Reviews.GetAverageRatingByHelperIdAsync(helper.HelperId);
            var searchHelper = new SearchHelperDto
            {
                helperId = helper.HelperId,
                helperName = helper.FullName,
                basePrice = service.BasePrice,
                rating = (decimal)rating,
                bio = helper.Bio,
                serviceName = service.ServiceName,
                HelperWorkAreas = helperWorkAreas.ToList(),
                availableStatus = helper.AvailableStatus.ToString(),
            };
            searchHelpers.Add(searchHelper);
        }
        return searchHelpers;
    }

    public async Task<HelperAddMoneyToWalletResponseDto> AddMoneyToWalletAsync(HelperAddMoneyToWalletDto helperAddMoneyToWalletDto)
    {

        _logger.LogInformation($"Adding money to wallet for helper ID: {helperAddMoneyToWalletDto.HelperId}, Amount: {helperAddMoneyToWalletDto.Amount}");
        var helper = await _unitOfWork.Helpers.GetQueryable(h => h.HelperWallet).FirstOrDefaultAsync(h => h.HelperId == helperAddMoneyToWalletDto.HelperId);
        if (helper == null)
        {
            _logger.LogWarning($"Helper with ID {helperAddMoneyToWalletDto.HelperId} not found");
            return new HelperAddMoneyToWalletResponseDto
            {
                IsSuccess = false,
                Message = "Helper not found"
            };
        }
        if (helper.HelperWallet == null)
        {
            _logger.LogWarning($"Helper wallet not found for ID {helperAddMoneyToWalletDto.HelperId}");
            return new HelperAddMoneyToWalletResponseDto
            {
                IsSuccess = false,
                Message = "Helper wallet not found"
            };
        }
        var wallet = helper.HelperWallet;
        wallet.Balance += helperAddMoneyToWalletDto.Amount;
        _unitOfWork.HelperWallets.Update(wallet);
        await _unitOfWork.CompleteAsync();
        _logger.LogInformation($"Successfully added money to wallet for helper ID: {helperAddMoneyToWalletDto.HelperId}");
        return new HelperAddMoneyToWalletResponseDto
        {
            IsSuccess = true,
            Message = "Money added successfully"
        };
    }
    public async Task<bool> isAvailalble(int helperId, DateTime startTime, DateTime endTime)
    {
        var bookingRepo = _unitOfWork.Bookings;
        var bookings = (await bookingRepo.GetAllAsync())
            .Where(b => b.HelperId == helperId
                && b.Status != Booking.AvailableStatus.Cancelled.ToString()
                && b.ScheduledStartTime < endTime
                && b.ScheduledEndTime > startTime)
            .ToList();

        var isBooked = bookings.Any();
        return !isBooked;
    }

    public async Task<bool> ResetPasswordAsync(string email, string newPassword)
    {
        _logger.LogInformation($"Resetting password for helper with email: {email}");

        var helper = await _unitOfWork.Helpers.GetHelperByEmailAsync(email);
        if (helper == null)
        {
            _logger.LogWarning($"Helper with email {email} not found");
            return false;
        }

        // Hash new password
        var newPasswordHash = _passwordHasher.HashPassword(newPassword);
        helper.PasswordHash = newPasswordHash;

        // Update helper
        _unitOfWork.Helpers.Update(helper);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation($"Password reset successfully for helper with email: {email}");
        return true;
    }
}