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
using Services.DTOs.Admin;
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

        public async Task<bool> IsValidatedCreateRequest(ServiceRequest request)
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

            if(request.RequestedStartTime == null || request.RequestedStartTime < DateTime.UtcNow)
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
                serviceRequest.Status = ServiceRequest.AvailableStatus.Cancelled.ToString(); // Assuming "Cancelled" is the status for soft deletion
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

        public async Task<ServiceRequestActionResultDto> RespondToRequestAsync(int requestId, int bookingId, string action)
        {
            var serviceRepo = _unitOfWork.ServiceRequest;
            var request = await serviceRepo.GetByIdAsync(requestId);
            if (request == null)
            {
                _logger.LogWarning("Service request with id {RequestId} not found for response.", requestId);
                return new ServiceRequestActionResultDto { Success = false, Message = "Request not found" };
            }
            if (request.Status != "Pending")
            {
                return new ServiceRequestActionResultDto { Success = false, Message = "Request is no longer pending" };
            }
            if (action == "Accept")
            {
                ServiceRequest.AvailableStatus status = ServiceRequest.AvailableStatus.Accepted;
                request.Status = status.ToString();
                serviceRepo.Update(request);
                // Update the boooking status to InProgress
                var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId);
                if (booking == null)
                {
                    _logger.LogWarning("Booking with id {BookingId} not found for acceptance.", bookingId);
                    return new ServiceRequestActionResultDto { Success = false, Message = "Booking not found" };
                }
                booking.Status = Booking.AvailableStatus.InProgress.ToString();
                _unitOfWork.Bookings.Update(booking);
                await _unitOfWork.CompleteAsync();
                return new ServiceRequestActionResultDto { Success = true, Message = "Request accepted successfully" };
            }
            if (action == "Cancel")
            {
                ServiceRequest.AvailableStatus status = ServiceRequest.AvailableStatus.Cancelled;
                request.Status = status.ToString();
                serviceRepo.Update(request);
                // Update the booking status to Cancelled
                var booking = await _unitOfWork.Bookings.GetByIdAsync(bookingId);
                if (booking == null)
                {
                    _logger.LogWarning("Booking with id {BookingId} not found for cancellation.", bookingId);
                    return new ServiceRequestActionResultDto { Success = false, Message = "Booking not found" };
                }
                booking.Status = Booking.AvailableStatus.Cancelled.ToString();
                //booking.CancellationReason = "Request cancelled by user";
                //booking.CancelledBy = "User"; 
                booking.CancellationTime = DateTime.Now;
                _unitOfWork.Bookings.Update(booking);
                await _unitOfWork.CompleteAsync();
                return new ServiceRequestActionResultDto { Success = true, Message = "Request cancelled successfully" };
            }
            return new ServiceRequestActionResultDto { Success = false, Message = "Invalid action" };
        }

        public bool IsValidStatus(string status)
        {
            return status.Equals(ServiceRequest.AvailableStatus.Pending.ToString()) ||
                status.Equals(ServiceRequest.AvailableStatus.Accepted.ToString()) ||
                status.Equals(ServiceRequest.AvailableStatus.Cancelled.ToString());
        }

        public async Task<AdminServiceRequestListDto> GetServiceRequestsForAdminAsync(AdminServiceRequestFilterDto filter)
        {
            try
            {
                var (requests, totalCount) = await _unitOfWork.ServiceRequest.GetServiceRequestsForAdminAsync(
                    filter.Status,
                    filter.User,
                    filter.DateFrom,
                    filter.DateTo,
                    filter.Location,
                    filter.Page,
                    filter.PageSize);

                var adminRequests = requests.Select(MapToAdminServiceRequestDto).ToList();

                return new AdminServiceRequestListDto
                {
                    Requests = adminRequests,
                    Total = totalCount,
                    Page = filter.Page,
                    PageSize = filter.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting service requests for admin");
                throw new Exception("An error occurred while retrieving service requests.", ex);
            }
        }

        public async Task<byte[]> ExportServiceRequestsToCsvAsync(AdminServiceRequestFilterDto filter)
        {
            try
            {
                // Get all requests without pagination for export
                var exportFilter = new AdminServiceRequestFilterDto
                {
                    Status = filter.Status,
                    User = filter.User,
                    DateFrom = filter.DateFrom,
                    DateTo = filter.DateTo,
                    Location = filter.Location,
                    Page = 1,
                    PageSize = int.MaxValue
                };

                var (requests, _) = await _unitOfWork.ServiceRequest.GetServiceRequestsForAdminAsync(
                    exportFilter.Status,
                    exportFilter.User,
                    exportFilter.DateFrom,
                    exportFilter.DateTo,
                    exportFilter.Location,
                    exportFilter.Page,
                    exportFilter.PageSize);

                var csv = new StringBuilder();

                // CSV Header
                csv.AppendLine("RequestId,UserName,UserEmail,HelperName,ServiceName,ScheduledTime,Location,Status,RequestCreationTime,SpecialNotes,DurationHours");

                // CSV Data
                foreach (var request in requests)
                {
                    var adminRequest = MapToAdminServiceRequestDto(request);
                    var helperName = adminRequest.Helper?.Name ?? "";
                    var serviceName = adminRequest.Services.FirstOrDefault() ?? "";

                    csv.AppendLine($"{adminRequest.RequestId}," +
                                 $"\"{adminRequest.User.Name}\"," +
                                 $"\"{adminRequest.User.Email}\"," +
                                 $"\"{helperName}\"," +
                                 $"\"{serviceName}\"," +
                                 $"{adminRequest.ScheduledTime:yyyy-MM-dd HH:mm:ss}," +
                                 $"\"{adminRequest.Location}\"," +
                                 $"{adminRequest.Status}," +
                                 $"{adminRequest.RequestCreationTime:yyyy-MM-dd HH:mm:ss}," +
                                 $"\"{adminRequest.SpecialNotes ?? ""}\"," +
                                 $"{adminRequest.RequestedDurationHours ?? 0}");
                }

                return Encoding.UTF8.GetBytes(csv.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while exporting service requests to CSV");
                throw new Exception("An error occurred while exporting service requests.", ex);
            }
        }

        private AdminServiceRequestDto MapToAdminServiceRequestDto(ServiceRequest request)
        {
            // Determine status based on ServiceRequest status and Booking status
            var status = DetermineRequestStatus(request);

            // Get helper info from the most recent booking if available
            var latestBooking = request.Bookings?.OrderByDescending(b => b.BookingCreationTime).FirstOrDefault();

            return new AdminServiceRequestDto
            {
                RequestId = request.RequestId,
                User = new AdminUserInfoDto
                {
                    Id = request.User.UserId,
                    Name = request.User.FullName ?? "",
                    Email = request.User.Email ?? ""
                },
                Helper = latestBooking?.Helper != null ? new AdminHelperInfoDto
                {
                    Id = latestBooking.Helper.HelperId,
                    Name = latestBooking.Helper.FullName
                } : null,
                Services = new List<string> { request.Service.ServiceName },
                ScheduledTime = request.RequestedStartTime,
                Location = request.Address.FullAddress ?? $"{request.Address.AddressLine1}, {request.Address.District}, {request.Address.City}",
                Status = status,
                RequestCreationTime = request.RequestCreationTime,
                SpecialNotes = request.SpecialNotes,
                RequestedDurationHours = request.RequestedDurationHours
            };
        }

        private string DetermineRequestStatus(ServiceRequest request)
        {
            // If request is cancelled, return cancelled
            if (request.Status?.ToLower() == "cancelled")
                return "cancelled";

            // Check if there are any bookings
            var latestBooking = request.Bookings?.OrderByDescending(b => b.BookingCreationTime).FirstOrDefault();

            if (latestBooking == null)
            {
                // No booking exists
                return request.Status?.ToLower() == "pending" ? "pending" : "pending";
            }

            // Map booking status to admin status
            return latestBooking.Status.ToLower() switch
            {
                "pending" or "inprogress" => "matched",
                "completed" => "completed",
                "cancelled" => "cancelled",
                _ => "pending"
            };
        }
        public async Task<IEnumerable<GetAllServiceRequestDto>> GetAllServiceRequestByHelperId(int helperId)
        {
            var serviceRequests = await _unitOfWork.ServiceRequest.GetAllServiceRequestByHelperId(helperId);
            var requestsByHelper = serviceRequests
                .Select(r => new GetAllServiceRequestDto
                {
                    RequestId = r.RequestId,
                    FullName = r.User.FullName,
                    ServiceId = r.Service.ServiceId,
                    AddressId = r.AddressId,
                    Status = r.Status,
                    RequestCreationTime = r.RequestCreationTime,
                    SpecialNotes = r.SpecialNotes,
                    RequestedDurationHours = r.RequestedDurationHours,
                    Ward = r.Address.Ward,
                    District = r.Address.District,
                    City = r.Address.City,
                    FullAddress = r.Address.FullAddress,
                    Latitude = r.Latitude,
                    Longitude = r.Longitude,
                    UserId = r.UserId,
                    BasePrice = r.Service.BasePrice,
                    RequestedStartTime = r.RequestedStartTime,
                    ServiceName = r.Service.ServiceName
                }).ToList();
            return requestsByHelper;
        }

        public async Task<List<ServiceRequest>> getPendingRequests()
        {
            var requestRepo = _unitOfWork.ServiceRequest;
            var list = (await requestRepo.GetAllAsync());
            var result = list
                .Where(r => r.Status == ServiceRequest.AvailableStatus.Pending.ToString())
                .ToList();
            return result;
        }

        public async Task<List<ServiceRequest>> getUserPendingRequests(int id)
        {
            var requestRepo = _unitOfWork.ServiceRequest;
            var list = (await requestRepo.GetAllAsync());
            var result = list
                .Where(r => r.UserId == id && r.Status == ServiceRequest.AvailableStatus.Pending.ToString())
                .ToList();
            return result;
        }
    }
}
