using BussinessObjects.Models;
using Repositories;
using Repositories.Interfaces;
using Services.Interfaces;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Services.Implements
{
    public class OtpService : IOtpService
    {
        private readonly IOtpVerificationRepository _otpRepo;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private const int OtpLength = 6;
        private const int OtpExpiryMinutes = 5;

        public OtpService(IOtpVerificationRepository otpRepo, IEmailService emailService, IUnitOfWork unitOfWork)
        {
            _otpRepo = otpRepo;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
        }

        public async Task<string> GenerateAndSendOtpAsync(string email)
        {
            var otpCode = GenerateOtpCode();
            var otp = new OtpVerification
            {
                Identifier = email,
                OtpCode = otpCode,
                ExpiryDateTime = DateTime.Now.AddMinutes(OtpExpiryMinutes),
                IsVerified = false,
                AttemptCount = 0,
                CreationDateTime = DateTime.Now
            };
            await _otpRepo.AddAsync(otp);
            await _unitOfWork.CompleteAsync();

            string subject = "Your OTP Code for Verification";
            string body = $@"
                <div style='font-family:Arial, sans-serif; font-size:16px; color:#333; padding:20px;'>
                    <h2 style='color:#007bff;'>Email Verification</h2>
                    <p>Dear user,</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div style='font-size:24px; font-weight:bold; color:#28a745; margin:20px 0;'>{otpCode}</div>
                    <p>This code is valid for the next 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p>Thanks,<br/>Your App Team</p>
                </div>";

            await _emailService.SendEmailAsync(email, subject, body);

            return otpCode;
        }

        public async Task<bool> VerifyOtpAsync(string email, string otpCode)
        {
            var otp = await _otpRepo.GetValidOtpAsync(email, otpCode);
            if (otp == null)
                return false;
            otp.IsVerified = true;
            _otpRepo.Update(otp);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        private string GenerateOtpCode()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var value = BitConverter.ToUInt32(bytes, 0) % 1000000;
            return value.ToString("D6");
        }
    }
} 