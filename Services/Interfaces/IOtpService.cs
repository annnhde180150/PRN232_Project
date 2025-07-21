using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IOtpService
    {
        Task<string> GenerateAndSendOtpAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otpCode);
    }
} 