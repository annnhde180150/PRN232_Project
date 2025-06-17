using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Helper;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelperController : ControllerBase
    {
        private readonly IHelperService _helperService;
        private readonly IPasswordHasher _passwordHasher;

        public HelperController(IHelperService helperService, IPasswordHasher passwordHasher)
        {
            _helperService = helperService;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] HelperRegisterDto model)
        {
            if (model == null)
            {
                return BadRequest("Helper data is required.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (await _helperService.IsEmailExistsAsync(model.Email))
                {
                    ModelState.AddModelError("Email", "Email is already registered.");
                    return BadRequest(ModelState);
                }

                if (await _helperService.IsPhoneNumberExistsAsync(model.PhoneNumber))
                {
                    ModelState.AddModelError("PhoneNumber", "Phone number is already registered.");
                    return BadRequest(ModelState);
                }

                // Map HelperRegisterDto to HelperCreateDto
                var helperCreateDto = new HelperCreateDto
                {
                    PhoneNumber = model.PhoneNumber,
                    Email = model.Email,
                    PasswordHash = _passwordHasher.HashPassword(model.Password),
                    FullName = model.FullName,
                    Bio = model.Bio,
                    DateOfBirth = model.DateOfBirth,
                    Gender = model.Gender,
                    IsActive = false // Waiting for approval
                };
                
                var result = await _helperService.CreateAsync(helperCreateDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while registering the helper.");
            }
        }

        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] HelperLoginDto model)
        //{
        //    return Ok();
        //}

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            return Ok();
        }
    }
} 