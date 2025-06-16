using AutoMapper;
using BussinessObjects.Models;
using Services.DTOs.Report;

namespace Services.Mappers;

public class ReportProfile : Profile
{
    public ReportProfile()
    {
        // Helper Analytics mappings
        CreateMap<Helper, HelperAnalyticsDto>()
            .ForMember(dest => dest.HelperId, opt => opt.MapFrom(src => src.HelperId))
            .ForMember(dest => dest.HelperName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.TotalHoursWorked, opt => opt.MapFrom(src => src.TotalHoursWorked ?? 0))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.AverageRating ?? 0))
            .ForMember(dest => dest.TotalBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CancelledBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CompletionRate, opt => opt.Ignore())
            .ForMember(dest => dest.TotalReviews, opt => opt.Ignore())
            .ForMember(dest => dest.TotalEarnings, opt => opt.Ignore())
            .ForMember(dest => dest.AverageBookingValue, opt => opt.Ignore())
            .ForMember(dest => dest.EarningsTrend, opt => opt.Ignore())
            .ForMember(dest => dest.ServiceBreakdown, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodStart, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodEnd, opt => opt.Ignore());

        // User Analytics mappings  
        CreateMap<User, UserAnalyticsDto>()
            .ForMember(dest => dest.TotalUsers, opt => opt.Ignore())
            .ForMember(dest => dest.NewRegistrations, opt => opt.Ignore())
            .ForMember(dest => dest.ActiveUsers, opt => opt.Ignore())
            .ForMember(dest => dest.InactiveUsers, opt => opt.Ignore())
            .ForMember(dest => dest.ActivityRate, opt => opt.Ignore())
            .ForMember(dest => dest.RegistrationTrend, opt => opt.Ignore())
            .ForMember(dest => dest.Engagement, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodStart, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodEnd, opt => opt.Ignore());
        
        // Service mappings
        CreateMap<Service, ServicePopularityDto>()
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.ServiceName))
            .ForMember(dest => dest.BookingsCount, opt => opt.Ignore())
            .ForMember(dest => dest.MarketShare, opt => opt.Ignore())
            .ForMember(dest => dest.TotalRevenue, opt => opt.Ignore())
            .ForMember(dest => dest.AverageRating, opt => opt.Ignore());
        
        CreateMap<Service, ServicePerformanceDto>()
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.ServiceName))
            .ForMember(dest => dest.BookingsCount, opt => opt.Ignore())
            .ForMember(dest => dest.TotalEarnings, opt => opt.Ignore())
            .ForMember(dest => dest.CompletionRate, opt => opt.Ignore());
        
                // Booking mappings
        CreateMap<Booking, BookingAnalyticsDto>()
            .ForMember(dest => dest.TotalBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CancelledBookings, opt => opt.Ignore())
            .ForMember(dest => dest.PendingBookings, opt => opt.Ignore())
            .ForMember(dest => dest.InProgressBookings, opt => opt.Ignore())
            .ForMember(dest => dest.CompletionRate, opt => opt.Ignore())
            .ForMember(dest => dest.CancellationRate, opt => opt.Ignore())
            .ForMember(dest => dest.AverageBookingValue, opt => opt.Ignore())
            .ForMember(dest => dest.TotalBookingValue, opt => opt.Ignore())
            .ForMember(dest => dest.BookingTrend, opt => opt.Ignore())
            .ForMember(dest => dest.PopularServices, opt => opt.Ignore())
            .ForMember(dest => dest.PeakHours, opt => opt.Ignore())
            .ForMember(dest => dest.StatusBreakdown, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodStart, opt => opt.Ignore())
            .ForMember(dest => dest.AnalyticsPeriodEnd, opt => opt.Ignore());

        // Payment mappings
        CreateMap<Payment, PaymentMethodDto>()
            .ForMember(dest => dest.Method, opt => opt.MapFrom(src => src.PaymentMethod))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.Amount))
            .ForMember(dest => dest.TransactionCount, opt => opt.Ignore())
            .ForMember(dest => dest.Percentage, opt => opt.Ignore())
            .ForMember(dest => dest.SuccessRate, opt => opt.Ignore());

        // Revenue mappings
        CreateMap<Payment, MonthlyRevenueDto>()
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.PaymentDate.HasValue ? src.PaymentDate.Value.Year : 0))
            .ForMember(dest => dest.Month, opt => opt.MapFrom(src => src.PaymentDate.HasValue ? src.PaymentDate.Value.Month : 0))
            .ForMember(dest => dest.MonthName, opt => opt.MapFrom(src => src.PaymentDate.HasValue ? src.PaymentDate.Value.ToString("MMMM") : ""))
            .ForMember(dest => dest.Revenue, opt => opt.MapFrom(src => src.Amount))
            .ForMember(dest => dest.PlatformFees, opt => opt.Ignore())
            .ForMember(dest => dest.HelperEarnings, opt => opt.Ignore())
            .ForMember(dest => dest.TransactionCount, opt => opt.Ignore())
            .ForMember(dest => dest.GrowthRate, opt => opt.Ignore());

        // Growth metrics (no direct entity mapping)
        CreateMap<object, GrowthMetricsDto>()
            .ForMember(dest => dest.UserGrowthRate, opt => opt.Ignore())
            .ForMember(dest => dest.BookingGrowthRate, opt => opt.Ignore())
            .ForMember(dest => dest.RevenueGrowthRate, opt => opt.Ignore())
            .ForMember(dest => dest.GrowthPeriod, opt => opt.Ignore());

        // Daily registration trend (no direct entity mapping)
        CreateMap<object, DailyRegistrationDto>()
            .ForMember(dest => dest.Date, opt => opt.Ignore())
            .ForMember(dest => dest.Count, opt => opt.Ignore());

        // Monthly earnings trend (no direct entity mapping)
        CreateMap<object, MonthlyEarningsDto>()
            .ForMember(dest => dest.Year, opt => opt.Ignore())
            .ForMember(dest => dest.Month, opt => opt.Ignore())
            .ForMember(dest => dest.MonthName, opt => opt.Ignore())
            .ForMember(dest => dest.Earnings, opt => opt.Ignore())
            .ForMember(dest => dest.BookingsCount, opt => opt.Ignore());
    }
} 