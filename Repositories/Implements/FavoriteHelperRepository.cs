using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Implements;

public class FavoriteHelperRepository : BaseRepository<FavoriteHelper>, IFavoriteHelperRepository
{
    public FavoriteHelperRepository(Prn232HomeHelperFinderSystemContext context) : base(context) { }

    public async Task<FavoriteHelper?> GetByUserAndHelperAsync(int userId, int helperId)
    {
        return await _context.FavoriteHelpers.FirstOrDefaultAsync(f => f.UserId == userId && f.HelperId == helperId);
    }

    public async Task<IEnumerable<FavoriteHelper>> GetByUserIdAsync(int userId)
    {
        return await _context.FavoriteHelpers
            .Include(f => f.Helper)
            .Where(f => f.UserId == userId)
            .ToListAsync();
    }

    public async Task<bool> DeleteByUserAndHelperAsync(int userId, int helperId)
    {
        var entity = await GetByUserAndHelperAsync(userId, helperId);
        if (entity == null) return false;
        _context.FavoriteHelpers.Remove(entity);
        return true;
    }
} 