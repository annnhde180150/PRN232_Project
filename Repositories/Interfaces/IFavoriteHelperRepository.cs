using BussinessObjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces;

public interface IFavoriteHelperRepository : IBaseRepository<FavoriteHelper>
{
    Task<FavoriteHelper?> GetByUserAndHelperAsync(int userId, int helperId);
    Task<IEnumerable<FavoriteHelper>> GetByUserIdAsync(int userId);
    Task<bool> DeleteByUserAndHelperAsync(int userId, int helperId);
} 