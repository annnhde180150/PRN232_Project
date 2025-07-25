﻿using AutoMapper;
using BussinessObjects.Migrations;
using BussinessObjects.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Services.DTOs.Booking;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;
using System.Net;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestsController(IServiceRequestService _requestService, IMapper _mapper, IUnitOfWork _unitOfWork, IHelperService _helperService, IUserAddressService _addressService, IBookingService _bookingService) : ControllerBase
    {
        [HttpGet("GetRequest/{id}")]
        public async Task<ActionResult> GetRequest(int id)
        {
            var result = await _requestService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost("CreateRequest")]
        //[Authorize]
        public async Task<ActionResult> CreateHelpRequest([FromBody] ServiceRequestCreateDto newRequest)
        {
            if (!await _requestService.IsValidatedCreateRequest(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //auto map to helper if no helper is assigned
            //if (newRequest.HelperId == null)
            //{
            //    var helperId = await _helperService.GetAvailableHelper(_mapper.Map<ServiceRequest>(newRequest));
            //    if (helperId != null)
            //    {
            //        newRequest.HelperId = helperId;
            //    }
            //    else
            //    {
            //        return StatusCode(StatusCodes.Status400BadRequest, "No Helper Available");
            //    }
            //}

            //notify


            //insert new Request
            Task createTask = _requestService.CreateAsync(newRequest);
            await createTask;
            if (!createTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create service request");
            }

            //return created Request under DetailDto
            var latestRequest = await _requestService.GetLatestRequestByUserId(newRequest.UserId);
            return Ok(_mapper.Map<ServiceRequestDetailDto>(latestRequest));
        }

        [HttpPut("EditRequest")]
        //[Authorize]
        public async Task<ActionResult> EditHelpRequest([FromBody] ServiceRequestUpdateDto updatedRequest)
        {
            var currentRequest = await _requestService.GetByIdAsync(updatedRequest.ServiceId, true);

            if (!await _requestService.IsValidatedCreateRequest(_mapper.Map<ServiceRequest>(updatedRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //check if valid status
            if (!_requestService.IsValidStatus(updatedRequest.Status))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //check for valid address Id
            if (updatedRequest.AddressId == null || !(await _addressService.ExistsAsync(updatedRequest.AddressId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //if booked must edit booking not request
            if (await _bookingService.isBooked(updatedRequest.RequestId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //must not change user
            if (updatedRequest.UserId != currentRequest.UserId)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //update Request
            Task updateTask = _requestService.UpdateAsync(updatedRequest.RequestId, updatedRequest);
            await updateTask;
            if (!updateTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update service request");
            }

            //return updated Request under DetailDto
            var request = await _requestService.GetByIdAsync(updatedRequest.RequestId, true);
            return Ok(_mapper.Map<ServiceRequestDetailDto>(request));

        }

        [HttpDelete("DeleteRequest/{id}")]
        //[Authorize]
        public async Task<ActionResult> DeleteHelpRequest(int id)
        {
            //check any constraint?

            var request = await _requestService.GetByIdAsync(id);
            if (request == null || request.Status != ServiceRequest.AvailableStatus.Pending.ToString())
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            }

            //check if existed request
            if (id == null || id <= 0 || !(await _requestService.ExistsAsync(id)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //delete Request
            Task deleteTask = _requestService.SoftDeleteRequest(id);
            await deleteTask;
            if (!deleteTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete service request");
            }
            return Ok("Delete Successfully");
        }



        [HttpPost("UpdateTracking")]
        public async Task<ActionResult> UpdateLocation([FromBody] RealTimeLocationDto location)
        {
            //Task starting
            var request = _requestService.GetByIdAsync(location.RequestId);

            //Verify valid location?
            if (!(await _addressService.isValidVietnamAddress(location.Longitude.Value, location.Latitude.Value)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            // fetch and update location of Request
            await request;
            if (!request.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update location");
            }
            var serviceRequest = request.Result;
            if (serviceRequest == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, "Service request not found");
            }
            serviceRequest.Latitude = location.Latitude;
            serviceRequest.Longitude = location.Longitude;

            await _requestService.UpdateAsync(serviceRequest.RequestId, _mapper.Map<ServiceRequestUpdateDto>(serviceRequest));

            //notify User 


            return Ok("Location updated successfully");
        }

        [HttpPut("UpdateRequestStatus")]
        //[Authorize] implement authorize when finish
        public async Task<ActionResult> UpdateRequestStatus([FromBody] ServiceRequestActionDto updatedRequest)
        {
            //check if valid status
            if (updatedRequest.Action != "Accept" && updatedRequest.Action != "Cancel")
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //check if existed request
            if (updatedRequest.RequestId == null || updatedRequest.RequestId <= 0 || !(await _requestService.ExistsAsync(updatedRequest.RequestId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //update Request
            var reusult = await _requestService.RespondToRequestAsync(updatedRequest.RequestId,updatedRequest.BookingId,updatedRequest.Action);
            return Ok(reusult);
        }

        [HttpGet("GetServiceRequest/{helperId}")]
        public async Task<ActionResult> GetServiceRequest(int helperId)
        {
            try
            {
                if (!await _helperService.ExistsAsync(helperId))
                {
                    return NotFound($"Helper with ID {helperId} not found");
                }
                //var serviceRequest = await _helperService.GetAvailableHelper(helperId);
                var helperGetServiceRequest = await _requestService.GetAllServiceRequestByHelperId(helperId);
                return Ok(helperGetServiceRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while getting the service request");
            }
        }

        [HttpGet("GetAvailableRequests")]
        public async Task<ActionResult> GetAvailableRequests()
        {
            try
            {
                var pendingRequests = await _requestService.getPendingRequests();
                return Ok(pendingRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching available requests");
            }
        }

        [HttpGet("GetUserUnbookedRequest/{id}")]
        public async Task<ActionResult> GetUnBookedRequest(int id)
        {
            try
            {
                var pendingRequests = await _requestService.getUserPendingRequests(id);
                return Ok(pendingRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching available requests");
            }
        }
    }
}
