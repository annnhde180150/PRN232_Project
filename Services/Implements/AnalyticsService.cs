using AutoMapper;
using Repositories;
using Services.DTOs.Report;
using Services.Interfaces;
using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Services.Implements;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AnalyticsService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<SystemOverviewDto> GetSystemOverviewAsync()
    {
        var totalUsers = await _unitOfWork.Users.CountAsync();
        var totalHelpers = await _unitOfWork.Helpers.CountAsync();
        var totalBookings = await _unitOfWork.Bookings.CountAsync();
        var activeBookings = await _unitOfWork.Bookings.GetBookingCountByStatusAsync("InProgress");
        var completedBookings = await _unitOfWork.Bookings.GetBookingCountByStatusAsync("Completed");
        var cancelledBookings = await _unitOfWork.Bookings.GetBookingCountByStatusAsync("Cancelled");
        var totalRevenue = await _unitOfWork.Bookings.GetTotalRevenueAsync();
        var averageRating = (decimal)await _unitOfWork.Reviews.GetAverageRatingAsync();
        var totalServices = await _unitOfWork.Services.CountAsync();
        var totalReviews = await _unitOfWork.Reviews.CountAsync();

        // Calculate growth metrics (compared to previous month)
        var currentMonth = DateTime.UtcNow.Date.AddDays(1 - DateTime.UtcNow.Day);
        var previousMonth = currentMonth.AddMonths(-1);
        
        var currentMonthUsers = await _unitOfWork.Users.CountAsync(u => u.RegistrationDate >= currentMonth);
        var previousMonthUsers = await _unitOfWork.Users.CountAsync(u => u.RegistrationDate >= previousMonth && u.RegistrationDate < currentMonth);
        
        var currentMonthBookings = (await _unitOfWork.Bookings.GetBookingsByDateRangeAsync(currentMonth, DateTime.UtcNow)).Count();
        var previousMonthBookings = (await _unitOfWork.Bookings.GetBookingsByDateRangeAsync(previousMonth, currentMonth)).Count();
        
        var currentMonthRevenue = await _unitOfWork.Bookings.GetRevenueByDateRangeAsync(currentMonth, DateTime.UtcNow);
        var previousMonthRevenue = await _unitOfWork.Bookings.GetRevenueByDateRangeAsync(previousMonth, currentMonth);

        var growthMetrics = new GrowthMetricsDto
        {
            UserGrowthRate = CalculateGrowthRate(previousMonthUsers, currentMonthUsers),
            BookingGrowthRate = CalculateGrowthRate(previousMonthBookings, currentMonthBookings),
            RevenueGrowthRate = CalculateGrowthRate((double)previousMonthRevenue, (double)currentMonthRevenue),
            GrowthPeriod = "Month"
        };

        return new SystemOverviewDto
        {
            TotalUsers = totalUsers,
            TotalHelpers = totalHelpers,
            TotalBookings = totalBookings,
            ActiveBookings = activeBookings,
            CompletedBookings = completedBookings,
            CancelledBookings = cancelledBookings,
            TotalRevenue = totalRevenue,
            AverageRating = averageRating,
            TotalServices = totalServices,
            TotalReviews = totalReviews,
            LastUpdated = DateTime.UtcNow,
            GrowthMetrics = growthMetrics
        };
    }

    public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;

        var allUsers = await _unitOfWork.Users.GetAllAsync();
        var newRegistrations = allUsers.Count(u => u.RegistrationDate >= start && u.RegistrationDate <= end);
        var activeUsers = allUsers.Count(u => u.IsActive == true);
        var inactiveUsers = allUsers.Count(u => u.IsActive == false);
        var totalUsers = allUsers.Count();

        // Registration trend (daily data for the period)
        var registrationTrend = new List<DailyRegistrationDto>();
        for (var date = start.Date; date <= end.Date; date = date.AddDays(1))
        {
            var count = allUsers.Count(u => u.RegistrationDate?.Date == date);
            registrationTrend.Add(new DailyRegistrationDto { Date = date, Count = count });
        }

        // User engagement metrics
        var usersWithBookings = allUsers.Count(u => u.Bookings.Any());
        var averageBookingsPerUser = totalUsers > 0 ? (decimal)allUsers.Sum(u => u.Bookings.Count) / totalUsers : 0;
        var usersWithReviews = allUsers.Count(u => u.Reviews.Any());

        var engagement = new UserEngagementDto
        {
            UsersWithBookings = usersWithBookings,
            AverageBookingsPerUser = averageBookingsPerUser,
            UsersWithReviews = usersWithReviews,
            RetentionRate = totalUsers > 0 ? (int)((decimal)activeUsers / totalUsers * 100) : 0
        };

        return new UserAnalyticsDto
        {
            NewRegistrations = newRegistrations,
            ActiveUsers = activeUsers,
            InactiveUsers = inactiveUsers,
            TotalUsers = totalUsers,
            ActivityRate = totalUsers > 0 ? (decimal)activeUsers / totalUsers * 100 : 0,
            RegistrationTrend = registrationTrend,
            Engagement = engagement,
            AnalyticsPeriodStart = start,
            AnalyticsPeriodEnd = end
        };
    }

    public async Task<UserAnalyticsDto> GetUserActivityAnalyticsAsync(int userId, string period = "month")
    {
        var dateRange = GetDateRangeForPeriod(period);
        return await GetUserAnalyticsAsync(dateRange.Start, dateRange.End);
    }

    public async Task<HelperAnalyticsDto> GetHelperAnalyticsAsync(int helperId, string period = "month")
    {
        var dateRange = GetDateRangeForPeriod(period);
        var helper = await _unitOfWork.Helpers.GetByIdAsync(helperId);
        
        if (helper == null)
            throw new ArgumentException($"Helper with ID {helperId} not found");

        // Use AutoMapper for basic mapping
        var helperAnalytics = _mapper.Map<HelperAnalyticsDto>(helper);

        var bookings = await _unitOfWork.Bookings.GetBookingsByHelperIdAsync(helperId);
        var periodBookings = bookings.Where(b => b.BookingCreationTime >= dateRange.Start && b.BookingCreationTime <= dateRange.End);
        
        var totalBookings = periodBookings.Count();
        var completedBookings = periodBookings.Count(b => b.Status == "Completed");
        var cancelledBookings = periodBookings.Count(b => b.Status == "Cancelled");
        
        var reviews = await _unitOfWork.Reviews.GetReviewsByHelperIdAsync(helperId);
        var averageRating = (decimal)await _unitOfWork.Reviews.GetAverageRatingByHelperIdAsync(helperId);
        
        var totalEarnings = periodBookings
            .Where(b => b.FinalPrice.HasValue && b.Status == "Completed")
            .Sum(b => b.FinalPrice.Value);

        // Monthly earnings trend
        var earningsTrend = new List<MonthlyEarningsDto>();
        for (var date = dateRange.Start; date <= dateRange.End; date = date.AddMonths(1))
        {
            var monthBookings = bookings.Where(b => 
                b.BookingCreationTime?.Year == date.Year && 
                b.BookingCreationTime?.Month == date.Month &&
                b.Status == "Completed" &&
                b.FinalPrice.HasValue);
            
            earningsTrend.Add(new MonthlyEarningsDto
            {
                Year = date.Year,
                Month = date.Month,
                MonthName = date.ToString("MMMM"),
                Earnings = monthBookings.Sum(b => b.FinalPrice.Value),
                BookingsCount = monthBookings.Count()
            });
        }

        // Service performance breakdown using AutoMapper for basic service mapping
        var serviceBreakdown = periodBookings
            .GroupBy(b => b.Service)
            .Select(g => 
            {
                var serviceDto = _mapper.Map<ServicePerformanceDto>(g.Key);
                serviceDto.BookingsCount = g.Count();
                serviceDto.TotalEarnings = g.Where(b => b.FinalPrice.HasValue && b.Status == "Completed").Sum(b => b.FinalPrice.Value);
                serviceDto.CompletionRate = g.Count() > 0 ? (decimal)g.Count(b => b.Status == "Completed") / g.Count() * 100 : 0;
                return serviceDto;
            }).ToList();

        // Update the mapped DTO with calculated values
        helperAnalytics.TotalBookings = totalBookings;
        helperAnalytics.CompletedBookings = completedBookings;
        helperAnalytics.CancelledBookings = cancelledBookings;
        helperAnalytics.CompletionRate = totalBookings > 0 ? (decimal)completedBookings / totalBookings * 100 : 0;
        helperAnalytics.AverageRating = averageRating;
        helperAnalytics.TotalReviews = reviews.Count();
        helperAnalytics.TotalEarnings = totalEarnings;
        helperAnalytics.AverageBookingValue = completedBookings > 0 ? totalEarnings / completedBookings : 0;
        helperAnalytics.EarningsTrend = earningsTrend;
        helperAnalytics.ServiceBreakdown = serviceBreakdown;
        helperAnalytics.AnalyticsPeriodStart = dateRange.Start;
        helperAnalytics.AnalyticsPeriodEnd = dateRange.End;

        return helperAnalytics;
    }

    public async Task<List<HelperAnalyticsDto>> GetTopPerformingHelpersAsync(int count = 10, string period = "month")
    {
        var helpers = await _unitOfWork.Helpers.GetAllAsync();
        var topHelpers = new List<HelperAnalyticsDto>();

        foreach (var helper in helpers.Take(count))
        {
            var analytics = await GetHelperAnalyticsAsync(helper.HelperId, period);
            topHelpers.Add(analytics);
        }

        return topHelpers.OrderByDescending(h => h.TotalEarnings).Take(count).ToList();
    }

    public async Task<BookingAnalyticsDto> GetBookingAnalyticsAsync(int? serviceId = null, string period = "month")
    {
        var dateRange = GetDateRangeForPeriod(period);
        IEnumerable<BussinessObjects.Models.Booking> bookings;

        if (serviceId.HasValue)
        {
            bookings = await _unitOfWork.Bookings.GetBookingsByServiceIdAsync(serviceId.Value);
        }
        else
        {
            bookings = await _unitOfWork.Bookings.GetAllAsync();
        }

        var periodBookings = bookings.Where(b => b.BookingCreationTime >= dateRange.Start && b.BookingCreationTime <= dateRange.End);

        var statusBreakdown = await _unitOfWork.Bookings.GetBookingStatusBreakdownAsync();
        var totalBookings = periodBookings.Count();
        
        var completedBookings = periodBookings.Count(b => b.Status == "Completed");
        var cancelledBookings = periodBookings.Count(b => b.Status == "Cancelled");
        
        var totalBookingValue = periodBookings
            .Where(b => b.FinalPrice.HasValue)
            .Sum(b => b.FinalPrice.Value);

        // Popular services using AutoMapper for basic service mapping
        var servicePopularity = periodBookings
            .GroupBy(b => b.Service)
            .Select(g => 
            {
                var serviceDto = _mapper.Map<ServicePopularityDto>(g.Key);
                serviceDto.BookingsCount = g.Count();
                serviceDto.TotalRevenue = g.Where(b => b.FinalPrice.HasValue && b.Status == "Completed").Sum(b => b.FinalPrice.Value);
                serviceDto.MarketShare = totalBookings > 0 ? (decimal)g.Count() / totalBookings * 100 : 0;
                return serviceDto;
            }).OrderByDescending(s => s.BookingsCount).ToList();

        // Peak hours analysis
        var peakHours = periodBookings
            .GroupBy(b => b.ScheduledStartTime.Hour)
            .Select(g => new PeakHourDto
            {
                Hour = g.Key,
                TimeRange = $"{g.Key:00}:00 - {(g.Key + 1):00}:00",
                BookingsCount = g.Count(),
                Percentage = totalBookings > 0 ? (decimal)g.Count() / totalBookings * 100 : 0
            }).OrderByDescending(p => p.BookingsCount).ToList();

        return new BookingAnalyticsDto
        {
            TotalBookings = totalBookings,
            CompletedBookings = completedBookings,
            CancelledBookings = cancelledBookings,
            InProgressBookings = periodBookings.Count(b => b.Status == "InProgress"),
            PendingBookings = periodBookings.Count(b => b.Status == "Pending"),
            ConfirmedBookings = periodBookings.Count(b => b.Status == "Confirmed"),
            AverageBookingValue = completedBookings > 0 ? totalBookingValue / completedBookings : 0,
            TotalBookingValue = totalBookingValue,
            CompletionRate = totalBookings > 0 ? (decimal)completedBookings / totalBookings * 100 : 0,
            CancellationRate = totalBookings > 0 ? (decimal)cancelledBookings / totalBookings * 100 : 0,
            PopularServices = servicePopularity,
            PeakHours = peakHours,
            AnalyticsPeriodStart = dateRange.Start,
            AnalyticsPeriodEnd = dateRange.End
        };
    }

    public async Task<List<ServicePopularityDto>> GetServicePopularityAnalyticsAsync(string period = "month")
    {
        var bookingAnalytics = await GetBookingAnalyticsAsync(null, period);
        return bookingAnalytics.PopularServices;
    }

    public async Task<RevenueReportDto> GetRevenueReportAsync(string period = "month")
    {
        var dateRange = GetDateRangeForPeriod(period);
        var payments = await _unitOfWork.Payments.GetPaymentsByDateRangeAsync(dateRange.Start, dateRange.End);
        
        var totalRevenue = payments.Where(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "Success").Sum(p => p.Amount);
        var platformFeeRate = 0.1m; // 10% platform fee
        var platformFees = totalRevenue * platformFeeRate;
        var helperEarnings = totalRevenue - platformFees;
        
        var totalTransactions = payments.Count();
        var successfulPayments = payments.Count(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "Success");
        var failedPayments = payments.Count(p => p.PaymentStatus == "Failed" || p.PaymentStatus == "Cancelled");

        // Monthly revenue trend
        var monthlyTrend = new List<MonthlyRevenueDto>();
        for (var date = dateRange.Start; date <= dateRange.End; date = date.AddMonths(1))
        {
            var monthPayments = payments.Where(p => 
                p.PaymentDate?.Year == date.Year && 
                p.PaymentDate?.Month == date.Month &&
                (p.PaymentStatus == "Completed" || p.PaymentStatus == "Success"));
            
            var monthRevenue = monthPayments.Sum(p => p.Amount);
            monthlyTrend.Add(new MonthlyRevenueDto
            {
                Year = date.Year,
                Month = date.Month,
                MonthName = date.ToString("MMMM"),
                Revenue = monthRevenue,
                PlatformFees = monthRevenue * platformFeeRate,
                HelperEarnings = monthRevenue - (monthRevenue * platformFeeRate),
                TransactionCount = monthPayments.Count()
            });
        }

        // Payment methods breakdown using AutoMapper for basic mapping
        var paymentMethods = payments
            .Where(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "Success")
            .GroupBy(p => p.PaymentMethod)
            .Select(g => 
            {
                var firstPayment = g.First();
                var paymentDto = _mapper.Map<PaymentMethodDto>(firstPayment);
                paymentDto.TransactionCount = g.Count();
                paymentDto.TotalAmount = g.Sum(p => p.Amount);
                paymentDto.Percentage = totalTransactions > 0 ? (decimal)g.Count() / totalTransactions * 100 : 0;
                return paymentDto;
            }).ToList();

        return new RevenueReportDto
        {
            TotalRevenue = totalRevenue,
            NetRevenue = helperEarnings,
            PlatformFees = platformFees,
            HelperEarnings = helperEarnings,
            AverageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
            TotalTransactions = totalTransactions,
            SuccessfulPayments = successfulPayments,
            FailedPayments = failedPayments,
            PaymentSuccessRate = totalTransactions > 0 ? (decimal)successfulPayments / totalTransactions * 100 : 0,
            MonthlyTrend = monthlyTrend,
            PaymentMethods = paymentMethods,
            AnalyticsPeriodStart = dateRange.Start,
            AnalyticsPeriodEnd = dateRange.End
        };
    }

    public async Task<List<MonthlyRevenueDto>> GetMonthlyRevenueTrendAsync(int months = 12)
    {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);
        
        var revenueReport = await GetRevenueReportAsync("custom");
        return revenueReport.MonthlyTrend;
    }

    public async Task<PerformanceMetricsDto> GetPerformanceMetricsAsync()
    {
        var totalBookings = await _unitOfWork.Bookings.CountAsync();
        var completedBookings = await _unitOfWork.Bookings.GetBookingCountByStatusAsync("Completed");
        var totalHelpers = await _unitOfWork.Helpers.CountAsync();
        var activeHelpers = (await _unitOfWork.Helpers.GetAllAsync()).Count(h => h.IsActive == true);
        var averageRating = (decimal)await _unitOfWork.Reviews.GetAverageRatingAsync();

        return new PerformanceMetricsDto
        {
            PlatformUtilizationRate = totalHelpers > 0 ? (decimal)activeHelpers / totalHelpers * 100 : 0,
            HelperEfficiencyScore = CalculateHelperEfficiencyScore(),
            CustomerSatisfactionScore = averageRating * 20, // Convert 5-star to 100-point scale
            ServiceQualityIndex = averageRating * 20,
            RetentionRate = CalculateRetentionRate(),
            LastCalculated = DateTime.UtcNow
        };
    }

    public async Task<byte[]> ExportSystemReportToCsvAsync(DateTime startDate, DateTime endDate)
    {
        var overview = await GetSystemOverviewAsync();
        var csv = new StringBuilder();
        
        csv.AppendLine("Metric,Value");
        csv.AppendLine($"Total Users,{overview.TotalUsers}");
        csv.AppendLine($"Total Helpers,{overview.TotalHelpers}");
        csv.AppendLine($"Total Bookings,{overview.TotalBookings}");
        csv.AppendLine($"Active Bookings,{overview.ActiveBookings}");
        csv.AppendLine($"Completed Bookings,{overview.CompletedBookings}");
        csv.AppendLine($"Total Revenue,{overview.TotalRevenue:C}");
        csv.AppendLine($"Average Rating,{overview.AverageRating:F2}");
        
        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    public async Task<byte[]> ExportHelperReportToCsvAsync(int helperId, DateTime startDate, DateTime endDate)
    {
        var analytics = await GetHelperAnalyticsAsync(helperId, "custom");
        var csv = new StringBuilder();
        
        csv.AppendLine("Metric,Value");
        csv.AppendLine($"Helper Name,{analytics.HelperName}");
        csv.AppendLine($"Total Bookings,{analytics.TotalBookings}");
        csv.AppendLine($"Completed Bookings,{analytics.CompletedBookings}");
        csv.AppendLine($"Completion Rate,{analytics.CompletionRate:F2}%");
        csv.AppendLine($"Average Rating,{analytics.AverageRating:F2}");
        csv.AppendLine($"Total Earnings,{analytics.TotalEarnings:C}");
        
        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    public async Task<byte[]> ExportBookingReportToCsvAsync(DateTime startDate, DateTime endDate)
    {
        var analytics = await GetBookingAnalyticsAsync(null, "custom");
        var csv = new StringBuilder();
        
        csv.AppendLine("Metric,Value");
        csv.AppendLine($"Total Bookings,{analytics.TotalBookings}");
        csv.AppendLine($"Completed Bookings,{analytics.CompletedBookings}");
        csv.AppendLine($"Cancelled Bookings,{analytics.CancelledBookings}");
        csv.AppendLine($"Average Booking Value,{analytics.AverageBookingValue:C}");
        csv.AppendLine($"Completion Rate,{analytics.CompletionRate:F2}%");
        
        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    #region Private Helper Methods

    private decimal CalculateGrowthRate(double previous, double current)
    {
        if (previous == 0) return current > 0 ? 100 : 0;
        return (decimal)((current - previous) / previous * 100);
    }

    private decimal CalculateGrowthRate(int previous, int current)
    {
        if (previous == 0) return current > 0 ? 100 : 0;
        return (decimal)((current - previous) / (double)previous * 100);
    }

    private (DateTime Start, DateTime End) GetDateRangeForPeriod(string period)
    {
        var now = DateTime.UtcNow;
        return period.ToLower() switch
        {
            "day" => (now.Date, now.Date.AddDays(1).AddTicks(-1)),
            "week" => (now.AddDays(-7), now),
            "month" => (now.AddMonths(-1), now),
            "quarter" => (now.AddMonths(-3), now),
            "year" => (now.AddYears(-1), now),
            _ => (now.AddMonths(-1), now)
        };
    }

    private decimal CalculateHelperEfficiencyScore()
    {
        // This is a placeholder - implement based on your business logic
        return 85.0m;
    }

    private decimal CalculateRetentionRate()
    {
        // This is a placeholder - implement based on your business logic
        return 75.0m;
    }

    #endregion
} 