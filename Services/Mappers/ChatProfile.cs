using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Chat;

namespace Services.Mappers;

public class ChatProfile : Profile
{
    public ChatProfile()
    {
        CreateMap<Chat, ChatMessageDto>()
            .ForMember(dest => dest.SenderName, opt => opt.MapFrom(src => 
                src.SenderUserId.HasValue ? src.SenderUser!.FullName : src.SenderHelper!.FullName))
            .ForMember(dest => dest.SenderProfilePicture, opt => opt.MapFrom(src => 
                src.SenderUserId.HasValue ? src.SenderUser!.ProfilePictureUrl : src.SenderHelper!.ProfilePictureUrl))
            .ForMember(dest => dest.SenderType, opt => opt.MapFrom(src => 
                src.SenderUserId.HasValue ? "User" : "Helper"));

        CreateMap<SendMessageDto, Chat>()
            .ForMember(dest => dest.ChatId, opt => opt.Ignore())
            .ForMember(dest => dest.Timestamp, opt => opt.Ignore())
            .ForMember(dest => dest.IsReadByReceiver, opt => opt.Ignore())
            .ForMember(dest => dest.ReadTimestamp, opt => opt.Ignore())
            .ForMember(dest => dest.IsModerated, opt => opt.Ignore())
            .ForMember(dest => dest.ModeratorAdminId, opt => opt.Ignore())
            .ForMember(dest => dest.SenderUserId, opt => opt.Ignore())
            .ForMember(dest => dest.SenderHelperId, opt => opt.Ignore())
            .ForMember(dest => dest.Booking, opt => opt.Ignore())
            .ForMember(dest => dest.ModeratorAdmin, opt => opt.Ignore())
            .ForMember(dest => dest.ReceiverHelper, opt => opt.Ignore())
            .ForMember(dest => dest.ReceiverUser, opt => opt.Ignore())
            .ForMember(dest => dest.SenderHelper, opt => opt.Ignore())
            .ForMember(dest => dest.SenderUser, opt => opt.Ignore());
    }
} 