using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class ServiceRequestRepository(Prn232HomeHelperFinderSystemContext context)
        : BaseRepository<ServiceRequest>(context), IServiceRequestRepository
    {
        public async Task<(IEnumerable<ServiceRequest> requests, int totalCount)> GetServiceRequestsForAdminAsync(
            string? status = null,
            string? userFilter = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? location = null,
            int page = 1,
            int pageSize = 20)
        {
            var query = _context.ServiceRequests
                .Include(sr => sr.User)
                .Include(sr => sr.Service)
                .Include(sr => sr.Address)
                .Include(sr => sr.Bookings)
                    .ThenInclude(b => b.Helper)
                .AsNoTracking();

            // Apply filters
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(sr => sr.Status != null && sr.Status.ToLower() == status.ToLower());
            }

            if (!string.IsNullOrEmpty(userFilter))
            {
                query = query.Where(sr =>
                    (sr.User.FullName != null && sr.User.FullName.Contains(userFilter)) ||
                    (sr.User.Email != null && sr.User.Email.Contains(userFilter)));
            }

            if (dateFrom.HasValue)
            {
                query = query.Where(sr => sr.RequestCreationTime >= dateFrom.Value);
            }

            if (dateTo.HasValue)
            {
                query = query.Where(sr => sr.RequestCreationTime <= dateTo.Value);
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(sr =>
                    (sr.Address.FullAddress != null && sr.Address.FullAddress.Contains(location)) ||
                    (sr.Address.AddressLine1 != null && sr.Address.AddressLine1.Contains(location)) ||
                    (sr.Address.District != null && sr.Address.District.Contains(location)) ||
                    (sr.Address.City != null && sr.Address.City.Contains(location)));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var requests = await query
                .OrderByDescending(sr => sr.RequestCreationTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (requests, totalCount);
        }
        public async Task<IEnumerable<ServiceRequest>> GetAllServiceRequestByHelperId(int helperId)
        {
            var serviceRequest = await _context.ServiceRequests
                .Include(sr => sr.User)
                .Include(sr => sr.Service)
                .Include(sr => sr.Address)
                .Include(sr => sr.Helper)
                .Where(sr => sr.HelperId == helperId && sr.Status == "Pending")
                .AsNoTracking()
                .ToListAsync();
            return serviceRequest;
        }
    }
}
