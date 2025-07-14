using Microsoft.AspNetCore.Mvc;
using Services.DTOs.UserAddress;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IUserAddressService _userAddressService;

        public AddressController(IUserAddressService addressService)
        {
            _userAddressService = addressService;
        }

        [HttpGet("UserAddress/{id}")]
        public async Task<ActionResult<UserAddressDetailDto>> GetUserAddressById(int id)
        {
            var address = await _userAddressService.GetByIdAsync(id);
            if (address == null) return NotFound();
            return Ok(address);
        }

        [HttpPost("UserAddress")]
        public async Task<ActionResult<UserAddressDetailDto>> CreateUserAddressB(UserAddressCreateDto dto)
        {
            var created = await _userAddressService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetUserAddressById), new { id = created.AddressId }, created);
        }

        [HttpPut("UserAddress/{id}")]
        public async Task<ActionResult<UserAddressDetailDto>> UpdateUserAddressB(int id, UserAddressUpdateDto dto)
        {
            var updated = await _userAddressService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("UserAddress/{id}")]
        public async Task<IActionResult> DeleteUserAddressB(int id)
        {
            await _userAddressService.DeleteAsync(id);
            return NoContent();
        }
    }
}
