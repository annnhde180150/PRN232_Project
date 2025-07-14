using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController(IServiceService _serviceService) : ControllerBase
    {
        [HttpGet]
        public Task<ActionResult> getServicesList()
        {
            var list = _serviceService.GetAllAsync();
            return Ok(list);
        }
    }
}
