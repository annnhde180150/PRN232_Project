using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.ServiceRequest;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestController(IUserService _userService, IServiceRequestService _requestService, IMapper _mapper) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> CreateHelpRequest([FromBody] ServiceRequestCreateDto newRequest)
        {
            //check if user is authenticated customer
            if(newRequest.UserId == null || newRequest.UserId <= 0)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            if(await _userService.ExistsAsync(newRequest.UserId))
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //check for valid ServiceId and AddressId
            if(newRequest.ServiceId == null || newRequest.ServiceId <= 0)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");
            //cannot check AddressId yet

            //set Status to "Pending" (Already in mapper)

            //reset CreationTime to current time (Already in mapper)

            //Check for valid duration (no more than 8 hourses, no less than 1 hour)
            if (newRequest.RequestedDurationHours == null ||
                newRequest.RequestedDurationHours <= 0 || 
                newRequest.RequestedDurationHours > 8m ||
                newRequest.RequestedDurationHours < 1m)
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid request");

            //insert new Request
            Task createTask = _requestService.CreateAsync(newRequest);
            Task.WaitAll(createTask);
            if(createTask.IsFaulted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create service request");
            }

            //return created Request under DetailDto
            var latestRequest = await _requestService.GetLatestRequestByUserId(newRequest.UserId);
            return Ok(_mapper.Map<ServiceRequestDetailDto>(latestRequest));
        }
    }
}
