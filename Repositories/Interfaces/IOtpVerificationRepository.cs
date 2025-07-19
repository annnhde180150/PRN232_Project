using BussinessObjects.Models;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IOtpVerificationRepository : IBaseRepository<OtpVerification>
    {
        Task<OtpVerification?> GetByIdentifierAsync(string identifier);
        Task<OtpVerification?> GetValidOtpAsync(string identifier, string otpCode);

    }
} 