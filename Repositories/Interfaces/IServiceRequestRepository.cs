using BussinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IServiceRequestRepository : IBaseRepository<ServiceRequest>
    {
        Task<(IEnumerable<ServiceRequest> requests, int totalCount)> GetServiceRequestsForAdminAsync(
            string? status = null,
            string? userFilter = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? location = null,
            int page = 1,
            int pageSize = 20);
        Task<IEnumerable<ServiceRequest>> GetAllServiceRequestByHelperId(int helperId);
    }
}
