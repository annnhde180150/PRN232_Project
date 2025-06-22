using AutoMapper;
using BussinessObjects.Migrations;
using BussinessObjects.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;
using System.Net;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestController(IUserService _userService, IServiceRequestService _requestService, IMapper _mapper, IUnitOfWork _unitOfWork, IHelperService _helperService) : ControllerBase
    {
        [HttpPost("CreateRequest")]
        //[Authorize]
        public async Task<ActionResult> CreateHelpRequest([FromBody] ServiceRequestCreateDto newRequest)
        {
            if(!await isValidatedId(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //auto map to helper if no helper is assigned

            //notify 

            //insert new Request
            Task createTask = _requestService.CreateAsync(newRequest);
            Task.WaitAll(createTask);
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
            if(!await isValidatedId(_mapper.Map<ServiceRequest>(updatedRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //check if valid status

            //mapp helper if not assigned

            //notify helper

            //notify real time tracking (latitude and longtitude) if provided
            var location = new RealTimeLocationDto
            {
                RequestId = updatedRequest.RequestId,
                Latitude = updatedRequest.Latitude,
                Longitude = updatedRequest.Longitude
            };

            //update Request
            Task updateTask = _requestService.UpdateAsync(updatedRequest.RequestId, updatedRequest);
            Task.WaitAll(updateTask);
            if (!updateTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update service request");
            }
            //return updated Request under DetailDto
            var request = await _requestService.GetByIdAsync(updatedRequest.RequestId);
            return Ok(_mapper.Map<ServiceRequestDetailDto>(request));

        }

        [HttpDelete("DeleteRequest")]
        //[Authorize]
        public async Task<ActionResult> DeleteHelpRequest([FromQuery]int requestId)
        {
            //check any constraint?

            //notify Helper if assigned

            //check if existed request
            if (requestId == null || requestId <= 0 || !(await _requestService.ExistsAsync(requestId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //delete Request
            Task deleteTask = _requestService.SoftDeleteRequest(requestId);
            Task.WaitAll(deleteTask);
            if (!deleteTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete service request");
            }
            return Ok("Request deleted successfully");
        }

        [HttpPost("BookHelper")]
        //[Authorize]
        public async Task<ActionResult> BookHelperRequest([FromBody]ServiceRequestCreateDto newRequest)
        {
            if (!await isValidatedId(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //validate helper id and check if helper is available at time
            if (newRequest.HelperId == null || !(await _helperService.ExistsAsync(newRequest.HelperId.Value)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //notify 

            //insert new Request
            Task createTask = _requestService.CreateAsync(newRequest);
            Task.WaitAll(createTask);
            if (!createTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create service request");
            }

            //return created Request under DetailDto
            var latestRequest = await _requestService.GetLatestRequestByUserId(newRequest.UserId);
            return Ok(_mapper.Map<ServiceRequestDetailDto>(latestRequest));
        }

        [HttpPut("EditBookedRequest")]
        //[Authorized]
        public async Task<ActionResult> UpdateBookedRequest([FromBody] ServiceRequestUpdateDto updatedRequest)
        {
            if (!await isValidatedId(_mapper.Map<ServiceRequest>(updatedRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //helperId must not change
            var currentRequestHelperId = (await _requestService.GetByIdAsync(updatedRequest.RequestId)).HelperId;
            if(currentRequestHelperId == null || currentRequestHelperId != updatedRequest.HelperId)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //notify Helper

            //Check if valid state

            //Update Request
            await _requestService.UpdateAsync(updatedRequest.RequestId ,updatedRequest);
            var CurrentRequest = await _requestService.GetByIdAsync(updatedRequest.RequestId);
            return Ok(CurrentRequest);
        }

        public async Task<bool> isValidatedId(ServiceRequest request)
        {
            //check if user is authenticated customer
            if (request.UserId == null || request.UserId <= 0)
                return false;
            if (!(await _userService.ExistsAsync(request.UserId)))
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
    }
}
