using BussinessObjects.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces;

public interface IReviewReportRepository : IBaseRepository<ReviewReport>
{
    Task<IEnumerable<ReviewReport>> GetReportsByReviewIdAsync(int reviewId);
    Task<IEnumerable<ReviewReport>> GetReportsByHelperIdAsync(int helperId);
} 