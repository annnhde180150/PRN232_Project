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
    public class ServiceRequestService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger<ServiceRequestService> _logger)
        : BaseService<ServiceRequestDetailDto, ServiceRequestCreateDto, ServiceRequestUpdateDto, ServiceRequest>(_unitOfWork.ServiceRequest, _mapper, _unitOfWork),
        IServiceRequestService
    {
        public async Task<ServiceRequest> GetLatestRequestByUserId(int userId)
        {
            try
            {
                var serviceRepo = _unitOfWork.ServiceRequest;
                var latestRequest = (await serviceRepo.GetAllAsync())
                    .Where(u => u.UserId == userId)
                    .OrderByDescending(req => req.RequestCreationTime)
                    .FirstOrDefault();
                return latestRequest ?? new ServiceRequest() { RequestId = 0 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error happened while getting latest service request by user id {UserId}", userId);
            }
            return new ServiceRequest()
            {
                RequestId = 0
            };
        }

        public async Task SoftDeleteRequest(int requestId)
        {
            try
            {
                var serviceRepo = _unitOfWork.ServiceRequest;
                var serviceRequest = await serviceRepo.GetByIdAsync(requestId);
                if (serviceRequest == null)
                {
                    _logger.LogWarning("Service request with id {RequestId} not found for soft delete.", requestId);
                    throw new TaskCanceledException($"Service request with id {requestId} not found.");
                }
                serviceRequest.Status = "Cancelled"; // Assuming "Cancelled" is the status for soft deletion
                serviceRepo.Update(serviceRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error happened while soft deleting service request with id {RequestId}", requestId);
                throw new Exception("An error occurred while soft deleting the service request.", ex);
            }
            finally
            {
                await _unitOfWork.CompleteAsync();
            }
        }
    }
}
