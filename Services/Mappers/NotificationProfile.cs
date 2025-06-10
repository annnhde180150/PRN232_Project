using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Notification;

namespace Services.Mappers;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        // Mapping từ Notification entity sang NotificationDetailsDto
        CreateMap<Notification, NotificationDetailsDto>()
            .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.NotificationId))
            .ForMember(dest => dest.RecipientUserId, opt => opt.MapFrom(src => src.RecipientUserId))
            .ForMember(dest => dest.RecipientHelperId, opt => opt.MapFrom(src => src.RecipientHelperId))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.NotificationType))
            .ForMember(dest => dest.ReferenceId, opt => opt.MapFrom(src => src.ReferenceId))
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => src.IsRead))
            .ForMember(dest => dest.ReadTime, opt => opt.MapFrom(src => src.ReadTime))
            .ForMember(dest => dest.CreationTime, opt => opt.MapFrom(src => src.CreationTime))
            .ForMember(dest => dest.SentTime, opt => opt.MapFrom(src => src.SentTime));

        // Reverse mapping từ NotificationDetailsDto sang Notification entity
        CreateMap<NotificationDetailsDto, Notification>()
            .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.NotificationId))
            .ForMember(dest => dest.RecipientUserId, opt => opt.MapFrom(src => src.RecipientUserId))
            .ForMember(dest => dest.RecipientHelperId, opt => opt.MapFrom(src => src.RecipientHelperId))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.NotificationType))
            .ForMember(dest => dest.ReferenceId, opt => opt.MapFrom(src => src.ReferenceId))
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => src.IsRead))
            .ForMember(dest => dest.ReadTime, opt => opt.MapFrom(src => src.ReadTime))
            .ForMember(dest => dest.CreationTime, opt => opt.MapFrom(src => src.CreationTime))
            .ForMember(dest => dest.SentTime, opt => opt.MapFrom(src => src.SentTime))
            // Ignore navigation properties
            .ForMember(dest => dest.RecipientHelper, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientUser, opt => opt.Ignore());

        // Mapping từ NotificationCreateDto sang Notification entity
        CreateMap<NotificationCreateDto, Notification>()
            .ForMember(dest => dest.RecipientUserId, opt => opt.MapFrom(src => src.RecipientUserId))
            .ForMember(dest => dest.RecipientHelperId, opt => opt.MapFrom(src => src.RecipientHelperId))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.NotificationType))
            .ForMember(dest => dest.ReferenceId, opt => opt.MapFrom(src => src.ReferenceId))
            // Auto-set values
            .ForMember(dest => dest.NotificationId, opt => opt.Ignore()) // Will be set by database
            .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false)) // Default to unread
            .ForMember(dest => dest.ReadTime, opt => opt.Ignore()) // Will be set when marked as read
            .ForMember(dest => dest.CreationTime, opt => opt.Ignore()) // Will be set in service
            .ForMember(dest => dest.SentTime, opt => opt.Ignore()) // Will be set in service
            // Ignore navigation properties
            .ForMember(dest => dest.RecipientHelper, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientUser, opt => opt.Ignore());

        // Mapping từ NotificationUpdateDto sang Notification entity (chỉ map các field có thể update)
        CreateMap<NotificationUpdateDto, Notification>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
            .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.NotificationType))
            // Ignore all other properties
            .ForMember(dest => dest.NotificationId, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientUserId, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientHelperId, opt => opt.Ignore())
            .ForMember(dest => dest.ReferenceId, opt => opt.Ignore())
            .ForMember(dest => dest.IsRead, opt => opt.Ignore())
            .ForMember(dest => dest.ReadTime, opt => opt.Ignore())
            .ForMember(dest => dest.CreationTime, opt => opt.Ignore())
            .ForMember(dest => dest.SentTime, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientHelper, opt => opt.Ignore())
            .ForMember(dest => dest.RecipientUser, opt => opt.Ignore());
    }
}