using BussinessObjects.Models;
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
    }
}
