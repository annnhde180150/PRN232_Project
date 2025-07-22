using BussinessObjects.Models;
using Services.DTOs.Helper;
using Services.DTOs.Admin;
using Services.DTOs.ServiceRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IServiceRequestService : IBaseService<ServiceRequestDetailDto, ServiceRequestCreateDto, ServiceRequestUpdateDto>
    {
        public Task<ServiceRequest> GetLatestRequestByUserId(int userId);
        public Task SoftDeleteRequest(int requestId);
        public Task<bool> IsValidatedCreateRequest(ServiceRequest request);
        Task<ServiceRequestActionResultDto> RespondToRequestAsync(int requestId, int bookingId, string action);
        Task<IEnumerable<GetAllServiceRequestDto>> GetAllServiceRequestByHelperId(int helperId);
        public bool IsValidStatus(string status);
        // Admin methods
        Task<AdminServiceRequestListDto> GetServiceRequestsForAdminAsync(AdminServiceRequestFilterDto filter);
        Task<byte[]> ExportServiceRequestsToCsvAsync(AdminServiceRequestFilterDto filter);
        Task<List<ServiceRequest>> getPendingRequests();
        Task<List<ServiceRequest>> getUserPendingRequests(int id);
    }
}
