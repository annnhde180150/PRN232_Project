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
using Services.DTOs.Helper;

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
        public async Task<IEnumerable<HelperGetServiceRequestDto>> GetAllServiceRequestByHelperId(int helperId)
        {
            var allBookings = await _unitOfWork.Bookings.GetAllAsync();
            var helperBookings = allBookings
                .Where(b => b.HelperId == helperId)
                .ToList();

            // 2. Lấy toàn bộ requestId từ booking
            var requestIds = helperBookings.Select(b => b.RequestId).Distinct().ToList();

            // 3. Lấy các ServiceRequest có RequestId trong danh sách và Status = "Pending"
            var allRequests = await _unitOfWork.ServiceRequest.GetAllAsync();
            var filteredRequests = allRequests
                .Where(r => requestIds.Contains(r.RequestId) && r.Status == "Pending")
                .ToList();

            // 4. Lấy serviceId, userId, addressId
            var serviceIds = filteredRequests.Select(r => r.ServiceId).Distinct().ToList();
            var userIds = filteredRequests.Select(r => r.UserId).Distinct().ToList();
            var addressIds = filteredRequests.Select(r => r.AddressId).Distinct().ToList();

            // 5. Lấy Service, Address và User (để lấy Username)
            var services = await _unitOfWork.Services.GetAllAsync();
            var servicesDict = services.Where(s => serviceIds.Contains(s.ServiceId))
                                       .ToDictionary(s => s.ServiceId);

            var addresses = await _unitOfWork.addressRepository.GetAllAsync();
            var addressesDict = addresses.Where(a => addressIds.Contains(a.AddressId))
                                         .ToDictionary(a => a.AddressId);

            var users = await _unitOfWork.Users.GetAllAsync();
            var usersDict = users.Where(u => userIds.Contains(u.UserId))
                                 .ToDictionary(u => u.UserId);

            // 6. Map từng ServiceRequest sang DTO
            var result = filteredRequests.Select(request =>
            {
                var booking = helperBookings.FirstOrDefault(b => b.RequestId == request.RequestId);
                var address = addressesDict.ContainsKey(request.AddressId) ? addressesDict[request.AddressId] : null;
                var service = servicesDict.ContainsKey(request.ServiceId) ? servicesDict[request.ServiceId] : null;
                var user = usersDict.ContainsKey(request.UserId) ? usersDict[request.UserId] : null;

                return new HelperGetServiceRequestDto
                {
                    RequestId = request.RequestId,
                    Username = user?.FullName ?? "Unknown",
                    ScheduledStartTime = booking?.ScheduledStartTime ?? request.RequestedStartTime,
                    ScheduledEndTime = booking?.ScheduledEndTime ?? request.RequestedStartTime.AddHours((double)(request.RequestedDurationHours ?? 1)),
                    SpecialNotes = request.SpecialNotes ?? string.Empty,
                    ServiceName = service?.ServiceName ?? "Unknown",
                    EstimatedPrice = booking?.EstimatedPrice ?? 0,
                    Ward = address?.Ward ?? "",
                    District = address?.District ?? "",
                    City = address?.City ?? "",
                    FullAddress = address?.FullAddress ?? "",
                    Latitude = (double)(request.Latitude ?? 0),
                    Longitude = (double)(request.Longitude ?? 0)
                };
            }).ToList();

            return result;
        }
    }
}
