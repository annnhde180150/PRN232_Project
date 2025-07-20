using Services.DTOs.FavoriteHelper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.Interfaces;

public interface IFavoriteHelperService
{
    Task<FavoriteHelperDetailsDto> AddFavoriteAsync(FavoriteHelperCreateDto dto);
    Task<IEnumerable<FavoriteHelperDetailsDto>> GetFavoritesByUserAsync(int userId);
    Task<bool> DeleteFavoriteAsync(FavoriteHelperDeleteDto dto);
} 