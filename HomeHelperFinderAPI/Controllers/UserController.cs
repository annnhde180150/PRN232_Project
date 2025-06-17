using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.User;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher _passwordHasher;

        public UserController(IUserService userService, IPasswordHasher passwordHasher)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto model)
        {
            if (model == null)
            {
                return BadRequest("User data is required.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (await _userService.IsEmailExistsAsync(model.Email))
                {
                    ModelState.AddModelError("Email", "Email is already registered.");
                    return BadRequest(ModelState);
                }

                if (await _userService.IsPhoneNumberExistsAsync(model.PhoneNumber))
                {
                    ModelState.AddModelError("PhoneNumber", "Phone number is already registered.");
                    return BadRequest(ModelState);
                }

                // Map UserRegisterDto to UserCreateDto
                var userCreateDto = new UserCreateDto
                {
                    PhoneNumber = model.PhoneNumber,
                    Email = model.Email,
                    PasswordHash = _passwordHasher.HashPassword(model.Password),
                    FullName = model.FullName
                };
                
                var result = await _userService.CreateAsync(userCreateDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while registering the user.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            return Ok();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            return Ok();
        }
    }
} 