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
using Azure.Core;

namespace Services.Implements
{
    public class ServiceRequestService(IUnitOfWork _unitOfWork, IMapper _mapper, ILogger<ServiceRequestService> _logger, IUserService userService)
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

        public async Task<bool> isValidatedCreateRequest(ServiceRequest request)
        {
            //check if user is authenticated customer
            if (request.UserId == null || request.UserId <= 0)
                return false;
            if (!(await userService.ExistsAsync(request.UserId)))
                return false;
            //check for valid ServiceId
            if (request.ServiceId == null || request.ServiceId <= 0)
                return false;
            //cannot check AddressId yet

            //Check for valid duration (no more than 8 hourses, no less than 1 hour)
            if (request.RequestedDurationHours == null ||
                request.RequestedDurationHours <= 0 ||
                request.RequestedDurationHours > 8m ||
                request.RequestedDurationHours < 1m)
                return false;

            return true;
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

        public async Task<ServiceRequestActionResultDto> RespondToRequestAsync(int requestId, int helperId, string action,string? specialNote)
        {
            //var serviceRepo = _unitOfWork.ServiceRequest;
            //var request = await serviceRepo.GetByIdAsync(requestId);
            //if (request == null)
            //{
            //    _logger.LogWarning("Service request with id {RequestId} not found for response.", requestId);
            //    return new ServiceRequestActionResultDto { Success = false, Message = "Request not found" };
            //}
            //if (request.Status != "Pending")
            //{
            //    return new ServiceRequestActionResultDto { Success = false, Message = "Request is no longer pending" };
            //}
            //if (action == "Accept")
            //{
            //    ServiceRequest.AvailableStatus status = ServiceRequest.AvailableStatus.InProgress;
            //    request.Status = status.ToString();
            //    request.SpecialNotes = specialNote;
            //    serviceRepo.Update(request);
            //    await _unitOfWork.CompleteAsync();
            //    return new ServiceRequestActionResultDto { Success = true, Message = "Request accepted successfully" };
            //}
            //if (action == "Cancel")
            //{
            //    ServiceRequest.AvailableStatus status = ServiceRequest.AvailableStatus.Cancelled;
            //    request.Status = status.ToString();
            //    request.SpecialNotes = specialNote;
            //    serviceRepo.Update(request);
            //    await _unitOfWork.CompleteAsync();
            //    return new ServiceRequestActionResultDto { Success = true, Message = "Request cancelled successfully" };
            //}
            //return new ServiceRequestActionResultDto { Success = false, Message = "Invalid action" };
            return null;
        }

        public bool isValidStatus(string status)
        {
            return status.Equals(ServiceRequest.AvailableStatus.Pending) ||
                status.Equals(ServiceRequest.AvailableStatus.Accepted) ||
                status.Equals(ServiceRequest.AvailableStatus.Cancelled);
        }
    }
}
