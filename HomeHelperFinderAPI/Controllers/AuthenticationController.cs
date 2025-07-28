using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.DTOs.Admin;
using Services.DTOs.Helper;
using Services.DTOs.User;
using Services.Interfaces;
using AutoMapper;
using Services.DTOs.OtpVerification;

namespace HomeHelperFinderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHelperService _helperService;
        private readonly IAdminService _adminService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;
        private readonly IOtpService _otpService;

        public AuthenticationController(IUserService userService, IHelperService helperService, IAdminService adminService, IPasswordHasher passwordHasher, IJwtService jwtService, IMapper mapper, IOtpService otpService)
        {
            _userService = userService;
            _helperService = helperService;
            _adminService = adminService;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
            _mapper = mapper;
            _otpService = otpService;
        }

        #region Registration 
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

                var userCreateDto = _mapper.Map<UserCreateDto>(model);
                userCreateDto.PasswordHash = _passwordHasher.HashPassword(model.Password);

                var result = await _userService.CreateAsync(userCreateDto);
                await _otpService.GenerateAndSendOtpAsync(model.Email);
                return Ok(new { message = "Registration successful. Please check your email for the OTP to verify your account.", user = result });
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

                var helperCreateDto = _mapper.Map<HelperCreateDto>(model);
                helperCreateDto.PasswordHash = _passwordHasher.HashPassword(model.Password);

                var result = await _helperService.CreateAsync(helperCreateDto);
                await _otpService.GenerateAndSendOtpAsync(model.Email);
                return Ok(new { message = "Registration successful. Please check your email for the OTP to verify your account.", helper = result });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering the helper.");
            }
        }

        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminRegisterDto model)
        {
            if (!ValidateRegistrationModel(model))
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (await _adminService.IsUsernameExistsAsync(model.Username))
                {
                    ModelState.AddModelError("Username", "Username is already registered.");
                    return BadRequest(ModelState);
                }

                if (await _adminService.IsEmailExistsAsync(model.Email))
                {
                    ModelState.AddModelError("Email", "Email is already registered.");
                    return BadRequest(ModelState);
                }

                var adminCreateDto = _mapper.Map<AdminCreateDto>(model);
                adminCreateDto.PasswordHash = _passwordHasher.HashPassword(model.Password);

                var result = await _adminService.CreateAsync(adminCreateDto);
                await _otpService.GenerateAndSendOtpAsync(model.Email);
                return Ok(new { message = "Registration successful. Please check your email for the OTP to verify your account.", admin = result });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while registering the admin.");
            }
        }
        #endregion


        #region Login 
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
            if (user.IsActive != true)
            {
                return Unauthorized(new { message = "Account not active. Please verify your email." });
            }

            await _userService.UpdateLastLoginDateAsync(user.Id);
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
            if (helper.IsEmailVerified != true)
            {
                return Unauthorized(new { message = "Email not verified. Please check your email for the OTP." });
            }
            if (helper.IsActive != true)
            {
                return Unauthorized(new { message = "Account not active. Awaiting admin approval." });
            }

            await _helperService.UpdateLastLoginDateAsync(helper.Id);
            var token = _jwtService.GenerateJwtToken(helper);

            return Ok(new
            {
                message = "Login successful",
                token,
                helper = helper
            });
        }

        [HttpPost("login/admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] AdminLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = await _adminService.ValidateAdminCredentialsAsync(loginDto.Email, loginDto.Password);
            if (admin == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            if (admin.IsActive != true)
            {
                return Unauthorized(new { message = "Admin account not active. Please verify your email." });
            }

            await _adminService.UpdateLastLoginDateAsync(admin.Id);
            var token = _jwtService.GenerateJwtToken(admin);

            return Ok(new
            {
                message = "Login successful",
                token,
                admin = admin
            });
        }
        #endregion

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerificationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.OtpCode))
                return BadRequest(new { message = "Email and OTP code are required." });
            var result = await _otpService.VerifyOtpAsync(request.Email, request.OtpCode);
            if (!result)
                return BadRequest(new { message = "Invalid or expired OTP." });

            var user = await _userService.GetUserByEmailAsync(request.Email);
            if (user != null)
            {
                user.IsActive = true;
                var updateDto = _mapper.Map<UserUpdateDto>(user);
                await _userService.UpdateAsync(user.Id, updateDto);
                return Ok(new { message = "OTP verified successfully. Your account is now active." });
            }
            var helper = await _helperService.GetHelperByEmailAsync(request.Email);
            if (helper != null)
            {
                await _helperService.UpdateEmailVerificationStatusAsync(helper.Id, true);
                return Ok(new { message = "OTP verified successfully. Your email is now verified. Awaiting admin approval." });
            }
            var admin = await _adminService.GetAdminByEmailAsync(request.Email);
            if (admin != null)
            {
                admin.IsActive = true;
                var updateDto = _mapper.Map<AdminUpdateDto>(admin);
                await _adminService.UpdateAsync(admin.Id, updateDto);
                return Ok(new { message = "OTP verified successfully. Your admin account is now active." });
            }
            return Ok(new { message = "OTP verified, but no matching account found." });
        }

  

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logout successful" });
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
