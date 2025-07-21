using Services.DTOs.Review;
using System.Threading.Tasks;

namespace Services.Interfaces;

public interface IReviewReportService
{
    Task ReportReviewAsync(ReviewReportDto dto);
    Task<IEnumerable<ReviewReportDto>> GetAllAsync();
    Task<IEnumerable<ReviewReportDto>> GetByReviewIdAsync(int reviewId);
    Task<IEnumerable<ReviewReportDto>> GetByHelperIdAsync(int helperId);
    Task<ReviewReportDto> GetByIdAsync(int id);
} 