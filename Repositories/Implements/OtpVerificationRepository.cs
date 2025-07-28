using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class OtpVerificationRepository : BaseRepository<OtpVerification>, IOtpVerificationRepository
    {
        private readonly Prn232HomeHelperFinderSystemContext _context;

        public OtpVerificationRepository(Prn232HomeHelperFinderSystemContext context) : base(context)
        {
            _context = context;
        }

        public async Task<OtpVerification?> GetByIdentifierAsync(string identifier)
        {
            return await _context.OtpVerifications
                .OrderByDescending(o => o.CreationDateTime)
                .FirstOrDefaultAsync(o => o.Identifier == identifier);
        }

        public async Task<OtpVerification?> GetValidOtpAsync(string identifier, string otpCode)
        {
            var now = DateTime.Now;
            return await _context.OtpVerifications
                .Where(o => o.Identifier == identifier && o.OtpCode == otpCode && o.ExpiryDateTime > now && (o.IsVerified == null || o.IsVerified == false))
                .OrderByDescending(o => o.CreationDateTime)
                .FirstOrDefaultAsync();
        }
    }
} 