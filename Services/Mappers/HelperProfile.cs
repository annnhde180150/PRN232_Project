using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Helper;
using Services.DTOs.Admin;

namespace Services.Mappers;

public class HelperProfile : Profile
{
    public HelperProfile()
    {
        CreateMap<Helper, HelperDetailsDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.HelperId))
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
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.HelperSkills))
            .ForMember(dest => dest.WorkAreas, opt => opt.MapFrom(src => src.HelperWorkAreas))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.HelperDocuments));

        CreateMap<HelperDetailsDto, Helper>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.Id))
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
            .ForMember(dest => dest.RegistrationDate, opt => opt.MapFrom(src => DateTime.Now))
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

        CreateMap<HelperDetailsDto, HelperUpdateDto>()
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.Skills))
            .ForMember(dest => dest.WorkAreas, opt => opt.MapFrom(src => src.WorkAreas))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents));

        // Additional mappings needed for the above mapping to work
        CreateMap<HelperSkillDto, HelperSkillCreateDto>()
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.YearsOfExperience))
            .ForMember(dest => dest.IsPrimarySkill, opt => opt.MapFrom(src => src.IsPrimarySkill));

        CreateMap<HelperWorkAreaDto, HelperWorkAreaCreateDto>()
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District))
            .ForMember(dest => dest.Ward, opt => opt.MapFrom(src => src.Ward))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.RadiusKm, opt => opt.MapFrom(src => src.RadiusKm));

        CreateMap<HelperDocumentDto, HelperDocumentCreateDto>()
            .ForMember(dest => dest.DocumentType, opt => opt.MapFrom(src => src.DocumentType))
            .ForMember(dest => dest.DocumentUrl, opt => opt.MapFrom(src => src.DocumentUrl))
            .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => src.UploadDate))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        CreateMap<HelperWallet, HelperViewIncomeDto>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.WalletId, opt => opt.MapFrom(src => src.WalletId))
            .ForMember(dest => dest.Balance, opt => opt.MapFrom(src => src.Balance))
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.CurrencyCode))
            .ReverseMap();

        CreateMap<HelperSkillDto, HelperSkill>()
            .ForMember(dest => dest.HelperSkillId, opt => opt.MapFrom(src => src.HelperSkillId))
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.YearsOfExperience))
            .ForMember(dest => dest.IsPrimarySkill, opt => opt.MapFrom(src => src.IsPrimarySkill))
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.Service, opt => opt.Ignore());
        CreateMap<HelperSkill, HelperSkillDto>()
            .ForMember(dest => dest.HelperSkillId, opt => opt.MapFrom(src => src.HelperSkillId))
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.YearsOfExperience))
            .ForMember(dest => dest.IsPrimarySkill, opt => opt.MapFrom(src => src.IsPrimarySkill));

        CreateMap<HelperWorkAreaDto, HelperWorkArea>()
            .ForMember(dest => dest.WorkAreaId, opt => opt.MapFrom(src => src.WorkAreaId))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District))
            .ForMember(dest => dest.Ward, opt => opt.MapFrom(src => src.Ward))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.RadiusKm, opt => opt.MapFrom(src => src.RadiusKm))
            .ForMember(dest => dest.Helper, opt => opt.Ignore());
        CreateMap<HelperWorkArea, HelperWorkAreaDto>()
            .ForMember(dest => dest.WorkAreaId, opt => opt.MapFrom(src => src.WorkAreaId))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District))
            .ForMember(dest => dest.Ward, opt => opt.MapFrom(src => src.Ward))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.RadiusKm, opt => opt.MapFrom(src => src.RadiusKm));

        CreateMap<HelperDocumentDto, HelperDocument>()
            .ForMember(dest => dest.DocumentId, opt => opt.MapFrom(src => src.DocumentId))
            .ForMember(dest => dest.DocumentType, opt => opt.MapFrom(src => src.DocumentType))
            .ForMember(dest => dest.DocumentUrl, opt => opt.MapFrom(src => src.DocumentUrl))
            .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => src.UploadDate))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => src.VerificationStatus))
            .ForMember(dest => dest.VerifiedByAdminId, opt => opt.MapFrom(src => src.VerifiedByAdminId))
            .ForMember(dest => dest.VerificationDate, opt => opt.MapFrom(src => src.VerificationDate))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.VerifiedByAdmin, opt => opt.Ignore());
        CreateMap<HelperDocument, HelperDocumentDto>()
            .ForMember(dest => dest.DocumentId, opt => opt.MapFrom(src => src.DocumentId))
            .ForMember(dest => dest.DocumentType, opt => opt.MapFrom(src => src.DocumentType))
            .ForMember(dest => dest.DocumentUrl, opt => opt.MapFrom(src => src.DocumentUrl))
            .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => src.UploadDate))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => src.VerificationStatus))
            .ForMember(dest => dest.VerifiedByAdminId, opt => opt.MapFrom(src => src.VerifiedByAdminId))
            .ForMember(dest => dest.VerificationDate, opt => opt.MapFrom(src => src.VerificationDate))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        CreateMap<HelperRegisterDto, HelperCreateDto>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Set in controller
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.Skills))
            .ForMember(dest => dest.WorkAreas, opt => opt.MapFrom(src => src.WorkAreas))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents));

        CreateMap<HelperSkillCreateDto, HelperSkill>()
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.YearsOfExperience, opt => opt.MapFrom(src => src.YearsOfExperience))
            .ForMember(dest => dest.IsPrimarySkill, opt => opt.MapFrom(src => src.IsPrimarySkill))
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.Service, opt => opt.Ignore());
        CreateMap<HelperWorkAreaCreateDto, HelperWorkArea>()
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.District, opt => opt.MapFrom(src => src.District))
            .ForMember(dest => dest.Ward, opt => opt.MapFrom(src => src.Ward))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.RadiusKm, opt => opt.MapFrom(src => src.RadiusKm))
            .ForMember(dest => dest.Helper, opt => opt.Ignore());
        CreateMap<HelperDocumentCreateDto, HelperDocument>()
            .ForMember(dest => dest.DocumentType, opt => opt.MapFrom(src => src.DocumentType))
            .ForMember(dest => dest.DocumentUrl, opt => opt.MapFrom(src => src.DocumentUrl))
            .ForMember(dest => dest.UploadDate, opt => opt.MapFrom(src => src.UploadDate))
            .ForMember(dest => dest.VerificationStatus, opt => opt.MapFrom(src => "Pending"))
            .ForMember(dest => dest.VerifiedByAdminId, opt => opt.MapFrom(src => (int?)null))
            .ForMember(dest => dest.VerificationDate, opt => opt.MapFrom(src => (DateTime?)null))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
            .ForMember(dest => dest.Helper, opt => opt.Ignore())
            .ForMember(dest => dest.VerifiedByAdmin, opt => opt.Ignore());

        // Admin DTOs mappings
        CreateMap<Helper, HelperApplicationDetailsDto>()
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
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.HelperDocuments))
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.HelperSkills))
            .ForMember(dest => dest.WorkAreas, opt => opt.MapFrom(src => src.HelperWorkAreas))
            .ForMember(dest => dest.TotalDocuments, opt => opt.Ignore()) // Calculated in service
            .ForMember(dest => dest.VerifiedDocuments, opt => opt.Ignore()) // Calculated in service
            .ForMember(dest => dest.PendingDocuments, opt => opt.Ignore()); // Calculated in service

        CreateMap<HelperRegisterDto, HelperCreateDto>();
    }
}