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
        public async Task<ActionResult> getServicesList()
        {
            var list = await _serviceService.GetAllAsync();
            return Ok(list);
        }
    }
}
