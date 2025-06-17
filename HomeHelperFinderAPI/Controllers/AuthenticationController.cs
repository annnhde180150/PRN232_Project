using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Helper;
using Services.DTOs.User;
using Services.Interfaces;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHelperService _helperService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;

        public AuthenticationController(IUserService userService, IHelperService helperService, IPasswordHasher passwordHasher, IJwtService jwtService)
        {
            _userService = userService;
            _helperService = helperService;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }

        [HttpPost("register/user")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterDto model)
        {
            if (!ValidateRegistrationModel(model))
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
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering the user.");
            }
        }

        [HttpPost("register/helper")]
        public async Task<IActionResult> RegisterHelper([FromBody] HelperRegisterDto model)
        {
            if (!ValidateRegistrationModel(model))
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
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering the helper.");
            }
        }

        [HttpPost("login/user")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.ValidateUserCredentialsAsync(loginDto.Email, loginDto.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            await _userService.UpdateLastLoginDateAsync(user.UserId);
            var token = _jwtService.GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful",
                token,
                user = user
            });
        }

        [HttpPost("login/helper")]
        public async Task<IActionResult> LoginHelper([FromBody] HelperLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var helper = await _helperService.ValidateHelperCredentialsAsync(loginDto.Email, loginDto.Password);
            if (helper == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            await _helperService.UpdateLastLoginDateAsync(helper.HelperId);
            var token = _jwtService.GenerateJwtToken(helper);

            return Ok(new
            {
                message = "Login successful",
                token,
                helper = helper
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok();
        }

        private bool ValidateRegistrationModel<T>(T model) where T : class
        {
            if (model == null)
            {
                ModelState.AddModelError("", "Registration data is required.");
                return false;
            }

            if (!ModelState.IsValid)
            {
                return false;
            }

            return true;
        }
    }
}
