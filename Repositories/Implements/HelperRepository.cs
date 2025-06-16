using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class HelperRepository(Prn232HomeHelperFinderSystemContext context)
    : BaseRepository<Helper>(context), IHelperRepository
{
    public async Task<Helper?> GetHelperByEmailAsync(string email)
    {
        return await _context.Helpers
            .FirstOrDefaultAsync(h => h.Email == email);
    }

    public async Task<Helper?> GetHelperByPhoneAsync(string phoneNumber)
    {
        return await _context.Helpers
            .FirstOrDefaultAsync(h => h.PhoneNumber == phoneNumber);
    }

    public async Task<IEnumerable<Helper>> GetActiveHelpersAsync()
    {
        return await _context.Helpers
            .Where(h => h.IsActive == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<Helper>> GetInactiveHelpersAsync()
    {
        return await _context.Helpers
            .Where(h => h.IsActive == false)
            .ToListAsync();
    }
}