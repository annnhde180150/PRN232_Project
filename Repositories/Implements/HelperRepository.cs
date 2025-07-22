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

    public async Task<(IEnumerable<Helper> applications, int totalCount)> GetHelperApplicationsAsync(
        string? status = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.Helpers
            .Include(h => h.HelperDocuments)
            .Include(h => h.HelperSkills)
                .ThenInclude(hs => hs.Service)
            .Include(h => h.HelperWorkAreas)
            .AsNoTracking();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(h => h.ApprovalStatus == status);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination and ordering
        var applications = await query
            .OrderByDescending(h => h.RegistrationDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (applications, totalCount);
    }

    public async Task<Helper?> GetHelperApplicationByIdAsync(int helperId)
    {
        return await _context.Helpers
            .Include(h => h.HelperDocuments)
            .Include(h => h.HelperSkills)
                .ThenInclude(hs => hs.Service)
            .Include(h => h.HelperWorkAreas)
            .Include(h => h.ApprovedByAdmin)
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.HelperId == helperId);
    }

    public async Task<(IEnumerable<Helper> helpers, int totalCount)> SearchHelpersAsync(
        string? searchTerm = null,
        string? email = null,
        bool? isActive = null,
        string? availabilityStatus = null,
        decimal? minimumRating = null,
        int? excludeHelperId = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.Helpers
            .Include(h => h.HelperSkills)
                .ThenInclude(hs => hs.Service)
            .Include(h => h.HelperWorkAreas)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(h =>
                h.FullName.ToLower().Contains(lowerSearchTerm) ||
                (h.Email != null && h.Email.ToLower().Contains(lowerSearchTerm)) ||
                h.PhoneNumber.Contains(searchTerm) ||
                (h.Bio != null && h.Bio.ToLower().Contains(lowerSearchTerm)));
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(h => h.Email != null && h.Email.ToLower().Contains(email.ToLower()));
        }

        if (isActive.HasValue)
        {
            query = query.Where(h => h.IsActive == isActive.Value);
        }

        if (!string.IsNullOrWhiteSpace(availabilityStatus))
        {
            if (Enum.TryParse<AvailableStatusEnum>(availabilityStatus, true, out var status))
            {
                query = query.Where(h => h.AvailableStatus == status);
            }
        }

        if (minimumRating.HasValue)
        {
            query = query.Where(h => h.AverageRating >= minimumRating.Value);
        }

        if (excludeHelperId.HasValue)
        {
            query = query.Where(h => h.HelperId != excludeHelperId.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination and ordering
        var helpers = await query
            .OrderByDescending(h => h.AverageRating)
            .ThenBy(h => h.FullName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (helpers, totalCount);
    }
}