using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Helper;

namespace Services.Mappers;

public class HelperProfile : Profile
{
    public HelperProfile()
    {
        CreateMap<Helper, HelperDetailsDto>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.RegistrationDate))
            .ForMember(dest => dest.ApprovalStatus, opt => opt.MapFrom(src => src.ApprovalStatus))
            .ForMember(dest => dest.ApprovedByAdminId, opt => opt.MapFrom(src => src.ApprovedByAdminId))
            .ForMember(dest => dest.ApprovalDate, opt => opt.MapFrom(src => src.ApprovalDate))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.TotalHoursWorked, opt => opt.MapFrom(src => src.TotalHoursWorked))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.AverageRating))
            .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate));

        CreateMap<HelperDetailsDto, Helper>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => src.RegistrationDate))
            .ForMember(dest => dest.ApprovalStatus, opt => opt.MapFrom(src => src.ApprovalStatus))
            .ForMember(dest => dest.ApprovedByAdminId, opt => opt.MapFrom(src => src.ApprovedByAdminId))
            .ForMember(dest => dest.ApprovalDate, opt => opt.MapFrom(src => src.ApprovalDate))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.TotalHoursWorked, opt => opt.MapFrom(src => src.TotalHoursWorked))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.AverageRating))
            .ForMember(dest => dest.LastLoginDate, opt => opt.MapFrom(src => src.LastLoginDate))
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Don't map password hash from DTO
            .ForMember(dest => dest.ApprovedByAdmin, opt => opt.Ignore()) // Ignore navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.HelperDocuments, opt => opt.Ignore())
            .ForMember(dest => dest.HelperSkills, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWallet, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWorkAreas, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.WithdrawalRequests, opt => opt.Ignore());

        CreateMap<HelperCreateDto, Helper>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.PasswordHash))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.HelperId, opt => opt.Ignore()) // Auto-generated
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.ApprovalStatus, opt => opt.MapFrom(src => "Pending"))
            .ForMember(dest => dest.ApprovedByAdminId, opt => opt.Ignore()) // Set when approved
            .ForMember(dest => dest.ApprovalDate, opt => opt.Ignore()) // Set when approved
            .ForMember(dest => dest.TotalHoursWorked, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.AverageRating, opt => opt.Ignore()) // Calculated from reviews
            .ForMember(dest => dest.LastLoginDate, opt => opt.Ignore()) // Set on login
            .ForMember(dest => dest.ApprovedByAdmin, opt => opt.Ignore()) // Navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.HelperDocuments, opt => opt.Ignore())
            .ForMember(dest => dest.HelperSkills, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWallet, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWorkAreas, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.WithdrawalRequests, opt => opt.Ignore());

        CreateMap<HelperUpdateDto, Helper>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.HelperId, opt => opt.Ignore()) // Don't update ID
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Don't update password through this DTO
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore()) // Don't change
            .ForMember(dest => dest.ApprovalStatus, opt => opt.Ignore()) // Don't update through this DTO
            .ForMember(dest => dest.ApprovedByAdminId, opt => opt.Ignore()) // Don't update through this DTO
            .ForMember(dest => dest.ApprovalDate, opt => opt.Ignore()) // Don't update through this DTO
            .ForMember(dest => dest.TotalHoursWorked, opt => opt.Ignore()) // Calculated separately
            .ForMember(dest => dest.AverageRating, opt => opt.Ignore()) // Calculated from reviews
            .ForMember(dest => dest.LastLoginDate, opt => opt.Ignore()) // Don't change
            .ForMember(dest => dest.ApprovedByAdmin, opt => opt.Ignore()) // Navigation properties
            .ForMember(dest => dest.Bookings, opt => opt.Ignore())
            .ForMember(dest => dest.ChatReceiverHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.ChatSenderHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.FavoriteHelpers, opt => opt.Ignore())
            .ForMember(dest => dest.HelperDocuments, opt => opt.Ignore())
            .ForMember(dest => dest.HelperSkills, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWallet, opt => opt.Ignore())
            .ForMember(dest => dest.HelperWorkAreas, opt => opt.Ignore())
            .ForMember(dest => dest.Notifications, opt => opt.Ignore())
            .ForMember(dest => dest.Reviews, opt => opt.Ignore())
            .ForMember(dest => dest.SupportTickets, opt => opt.Ignore())
            .ForMember(dest => dest.WithdrawalRequests, opt => opt.Ignore());

        CreateMap<HelperWallet, HelperViewIncomeDto>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.WalletId, opt => opt.MapFrom(src => src.WalletId))
            .ForMember(dest => dest.Balance, opt => opt.MapFrom(src => src.Balance))
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.CurrencyCode))
            .ReverseMap();
    }
}