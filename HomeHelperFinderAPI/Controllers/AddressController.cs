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
        public async Task<ActionResult<UserAddressDetailDto>> CreateUserAddressById(UserAddressCreateDto dto)
        {
            var created = await _userAddressService.CreateAsync(dto);
            return Ok(new { data = created });
        }

        [HttpPut("UserAddress/{id}")]
        public async Task<ActionResult<UserAddressDetailDto>> UpdateUserAddressById(int id, UserAddressUpdateDto dto)
        {
            var updated = await _userAddressService.UpdateUserAddress(id, dto);
            if (updated == null) return NotFound($"User address with ID {id} not found");
            return Ok(updated);
        }

        [HttpDelete("UserAddress/{id}")]
        public async Task<IActionResult> DeleteUserAddressById(int id)
        {
            await _userAddressService.DeleteAsync(id);
            return Ok(new { success = true });
        }

        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<UserAddressDetailDto>>> GetUserAddressesByUserId(int userId)
        {
            var addresses = (await _userAddressService.GetAllAsync()).Where(a => a.UserId == userId);
            if (addresses == null || !addresses.Any()) return NotFound();
            return Ok(addresses);
        }
    }
}
