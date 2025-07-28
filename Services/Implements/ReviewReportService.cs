using Services.DTOs.Review;
using Services.Interfaces;
using System.Threading.Tasks;
using BussinessObjects.Models;
using Repositories;

namespace Services.Implements;

public class ReviewReportService : IReviewReportService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReviewReportService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task ReportReviewAsync(ReviewReportDto dto)
    {
        var report = new ReviewReport
        {
            ReviewId = dto.ReviewId,
            HelperId = dto.HelperId,
            Reason = dto.Reason,
            ReportedAt = DateTime.Now
        };
        await _unitOfWork.ReviewReports.AddAsync(report);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<IEnumerable<ReviewReportDto>> GetAllAsync()
    {
        var reports = await _unitOfWork.ReviewReports.GetAllAsync();
        return reports.Select(r => new ReviewReportDto
        {
            Id = r.Id,
            ReviewId = r.ReviewId,
            HelperId = r.HelperId,
            Reason = r.Reason,
            ReportedAt = r.ReportedAt,
            HelperName = r.Helper?.FullName,
            ReviewComment = r.Review?.Comment
        });
    }

    public async Task<IEnumerable<ReviewReportDto>> GetByReviewIdAsync(int reviewId)
    {
        var reports = await _unitOfWork.ReviewReports.GetReportsByReviewIdAsync(reviewId);
        return reports.Select(r => new ReviewReportDto
        {
            Id = r.Id,
            ReviewId = r.ReviewId,
            HelperId = r.HelperId,
            Reason = r.Reason,
            ReportedAt = r.ReportedAt,
            HelperName = r.Helper?.FullName,
            ReviewComment = r.Review?.Comment
        });
    }

    public async Task<IEnumerable<ReviewReportDto>> GetByHelperIdAsync(int helperId)
    {
        var reports = await _unitOfWork.ReviewReports.GetReportsByHelperIdAsync(helperId);
        return reports.Select(r => new ReviewReportDto
        {
            Id = r.Id,
            ReviewId = r.ReviewId,
            HelperId = r.HelperId,
            Reason = r.Reason,
            ReportedAt = r.ReportedAt,
            HelperName = r.Helper?.FullName,
            ReviewComment = r.Review?.Comment
        });
    }

    public async Task<ReviewReportDto> GetByIdAsync(int id)
    {
        var report = await _unitOfWork.ReviewReports.GetByIdAsync(id);
        if (report == null) return null;
        return new ReviewReportDto
        {
            Id = report.Id,
            ReviewId = report.ReviewId,
            HelperId = report.HelperId,
            Reason = report.Reason,
            ReportedAt = report.ReportedAt,
            HelperName = report.Helper?.FullName,
            ReviewComment = report.Review?.Comment
        };
    }
} 