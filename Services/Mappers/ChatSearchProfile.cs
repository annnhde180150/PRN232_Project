using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Chat;

namespace Services.Mappers;

public class ChatSearchProfile : Profile
{
    public ChatSearchProfile()
    {
        CreateMap<User, UserSearchDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.HasExistingConversation, opt => opt.Ignore())
            .ForMember(dest => dest.LastConversationDate, opt => opt.Ignore());

        CreateMap<Helper, HelperSearchDto>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.HasExistingConversation, opt => opt.Ignore())
            .ForMember(dest => dest.LastConversationDate, opt => opt.Ignore())
            .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => 
                src.HelperSkills.Select(hs => hs.Service.ServiceName).ToList()));
    }
}
