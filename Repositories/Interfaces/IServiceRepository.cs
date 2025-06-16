using BussinessObjects.Models;

namespace Repositories.Interfaces;

public interface IServiceRepository : IBaseRepository<Service>
{
    Task<IEnumerable<Service>> GetActiveServicesAsync();
    Task<IEnumerable<Service>> GetServicesByParentIdAsync(int parentId);
    Task<IEnumerable<Service>> GetPopularServicesAsync(int count = 10);
    Task<Dictionary<int, int>> GetServiceBookingCountsAsync();
    Task<Dictionary<int, decimal>> GetServiceRevenueAsync();
} 