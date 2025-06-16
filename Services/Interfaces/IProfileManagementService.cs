using Services.DTOs.Profile;

namespace Services.Interfaces;

public interface IProfileManagementService
{
    Task<ProfileStatusDto> BanProfileAsync(BanProfileDto dto);
    Task<ProfileStatusDto> UnbanProfileAsync(UnbanProfileDto dto);
    Task<ProfileStatusDto?> GetProfileStatusAsync(int profileId, string profileType);
    Task<IEnumerable<ProfileStatusDto>> GetBannedProfilesAsync();
    Task<IEnumerable<ProfileStatusDto>> GetActiveProfilesAsync();
    Task<bool> IsProfileBannedAsync(int profileId, string profileType);
}