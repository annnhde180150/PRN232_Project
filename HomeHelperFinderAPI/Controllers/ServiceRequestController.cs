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
            if (!await _requestService.isValidatedCreateRequest(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //auto map to helper if no helper is assigned
            if (newRequest.HelperId == null)
            {
                var helperId = await _helperService.GetAvailableHelper(_mapper.Map<ServiceRequest>(newRequest));
                if (helperId != null)
                {
                    newRequest.HelperId = helperId;
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "No Helper Available");
                }
            }

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
            if (!await _requestService.isValidatedCreateRequest(_mapper.Map<ServiceRequest>(updatedRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //check if valid status
            if (updatedRequest.Status != "Pending" && updatedRequest.Status != "InProgress" && updatedRequest.Status != "Completed" && updatedRequest.Status != "Cancelled")
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //mapp helper if not assigned
            if (updatedRequest.HelperId == null)
            {
                var helperId = await _helperService.GetAvailableHelper(_mapper.Map<ServiceRequest>(updatedRequest));
                if (helperId != null)
                {
                    updatedRequest.HelperId = helperId;
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "No Helper Available");
                }
            }

            //notify helper

            //notify real time tracking (latitude and longtitude) if provided
            if (updatedRequest.Latitude != null || updatedRequest.Longitude != null)
            {
                var location = new RealTimeLocationDto
                {
                    RequestId = updatedRequest.RequestId,
                    Latitude = updatedRequest.Latitude,
                    Longitude = updatedRequest.Longitude
                };
            }

            //update Request
            Task updateTask = _requestService.UpdateAsync(updatedRequest.RequestId, updatedRequest);
            await updateTask;
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
        public async Task<ActionResult> DeleteHelpRequest([FromQuery] int requestId)
        {
            //check any constraint?

            //notify Helper if assigned

            //check if existed request
            if (requestId == null || requestId <= 0 || !(await _requestService.ExistsAsync(requestId)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //delete Request
            Task deleteTask = _requestService.SoftDeleteRequest(requestId);
            await deleteTask;
            if (!deleteTask.IsCompleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete service request");
            }
            return Ok("Request deleted successfully");
        }

        [HttpPost("BookHelper")]
        //[Authorize]
        public async Task<ActionResult> BookHelperRequest([FromBody] ServiceRequestCreateDto newRequest)
        {
            if (!await _requestService.isValidatedCreateRequest(_mapper.Map<ServiceRequest>(newRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //validate helper id and check if helper is available at time
            if (newRequest.HelperId == null || !(await _helperService.ExistsAsync(newRequest.HelperId.Value)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

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

        [HttpPut("EditBookedRequest")]
        //[Authorized]
        public async Task<ActionResult> UpdateBookedRequest([FromBody] ServiceRequestUpdateDto updatedRequest)
        {
            if (!await _requestService.isValidatedCreateRequest(_mapper.Map<ServiceRequest>(updatedRequest)))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //helperId must not change
            var currentRequestHelperId = (await _requestService.GetByIdAsync(updatedRequest.RequestId)).HelperId;
            if (currentRequestHelperId == null || currentRequestHelperId != updatedRequest.HelperId)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //notify Helper

            //Check if valid state
            if (updatedRequest.Status != "Pending" && updatedRequest.Status != "InProgress" && updatedRequest.Status != "Completed" && updatedRequest.Status != "Cancelled")
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //Update Request
            await _requestService.UpdateAsync(updatedRequest.RequestId, updatedRequest);
            var CurrentRequest = await _requestService.GetByIdAsync(updatedRequest.RequestId);
            return Ok(CurrentRequest);
        }

        [HttpPost("TrackingUpdate")]
        public async Task<ActionResult> UpdateLocation([FromBody] RealTimeLocationDto location)
        {
            //Task starting
            var request = _requestService.GetByIdAsync(location.RequestId);

            //Verify valid location?

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
            var reusult = await _requestService.RespondToRequestAsync(updatedRequest.RequestId,updatedRequest.HelperId,updatedRequest.Action,updatedRequest.SpecialNotes);
            return Ok(reusult);
        }
    }
}
