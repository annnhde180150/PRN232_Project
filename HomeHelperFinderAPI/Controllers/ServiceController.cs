using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.DTOs.Service;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetActiveServices()
        {
            var services = await _serviceService.GetActiveServicesAsync();
            return Ok(services);
        }
    }
}
