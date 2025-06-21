using BussinessObjects.Models;
using Services.Interfaces;
using Repositories.Interfaces;
using Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Repositories;
using Microsoft.Extensions.Logging;
using Services.DTOs.User;
using Services.DTOs.ServiceRequest;

namespace Services.Implements
{
    public class ServiceRequestService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger _logger)
        : BaseService<ServiceRequestDetailDto, ServiceRequestCreateDto, ServiceRequestUpdateDto, ServiceRequest>(_unitOfWork.ServiceRequest, _mapper),
        IServiceRequestService
    {
        public async Task<ServiceRequest> GetLatestRequestByUserId(int userId)
        {
            try
            {
                var serviceRepo = _unitOfWork.ServiceRequest;
                var latestRequest = (await serviceRepo.GetAllAsync())
                    .OrderByDescending(req => req.RequestCreationTime)
                    .FirstOrDefault();
                return latestRequest?? new ServiceRequest() { RequestId = 0 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error happened while getting latest service request by user id {UserId}", userId);
            }
        }
    }
}
