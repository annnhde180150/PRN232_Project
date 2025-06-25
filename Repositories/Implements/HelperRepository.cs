using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using static BussinessObjects.Models.Helper;

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
    public async Task<bool> SetHelperStatusOnlineAsync(int helperId)
    {
        var helper = await GetByIdAsync(helperId);
        if (helper == null) return false;
        int status = (int)helper.AvailableStatus;
        helper.AvailableStatus = (AvailableStatusEnum)0;
        Console.WriteLine($"Setting helper "+(int)Helper.AvailableStatusEnum.Available );
        _context.Update(helper);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> SetHelperStatusOfflineAsync(int helperId)
    {
        var helper = await GetByIdAsync(helperId);
        if (helper == null) return false;
        int status = (int)helper.AvailableStatus;
        helper.AvailableStatus = (AvailableStatusEnum)2;
        _context.Update(helper);
        await _context.SaveChangesAsync();
        return true;
    }  
    public async Task<bool> SetHelperStatusBusyAsync(int helperId)
    {
        var helper = await GetByIdAsync(helperId);
        if (helper == null) return false;
        int status = (int)helper.AvailableStatus;
        helper.AvailableStatus = (AvailableStatusEnum)1;
        _context.Update(helper);
        await _context.SaveChangesAsync();
        return true;
    }
}