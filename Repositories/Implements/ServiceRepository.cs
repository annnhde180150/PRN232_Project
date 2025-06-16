using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements;

public class ServiceRepository : BaseRepository<Service>, IServiceRepository
{
    public ServiceRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Service>> GetActiveServicesAsync()
    {
        return await _context.Services
            .Where(s => s.IsActive == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<Service>> GetServicesByParentIdAsync(int parentId)
    {
        return await _context.Services
            .Where(s => s.ParentServiceId == parentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Service>> GetPopularServicesAsync(int count = 10)
    {
        return await _context.Services
            .Include(s => s.Bookings)
            .OrderByDescending(s => s.Bookings.Count)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Dictionary<int, int>> GetServiceBookingCountsAsync()
    {
        return await _context.Services
            .Include(s => s.Bookings)
            .ToDictionaryAsync(s => s.ServiceId, s => s.Bookings.Count);
    }

    public async Task<Dictionary<int, decimal>> GetServiceRevenueAsync()
    {
        return await _context.Services
            .Include(s => s.Bookings)
            .ToDictionaryAsync(
                s => s.ServiceId, 
                s => s.Bookings
                    .Where(b => b.FinalPrice.HasValue && b.Status == "Completed")
                    .Sum(b => b.FinalPrice.Value)
            );
    }
} 