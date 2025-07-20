using BussinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Implements;

public class ReviewReportRepository : BaseRepository<ReviewReport>, IReviewReportRepository
{
    public ReviewReportRepository(Prn232HomeHelperFinderSystemContext context) : base(context) { }

    public async Task<IEnumerable<ReviewReport>> GetReportsByReviewIdAsync(int reviewId)
    {
        return await _context.ReviewReports.Where(r => r.ReviewId == reviewId).ToListAsync();
    }

    public async Task<IEnumerable<ReviewReport>> GetReportsByHelperIdAsync(int helperId)
    {
        return await _context.ReviewReports.Where(r => r.HelperId == helperId).ToListAsync();
    }
} 