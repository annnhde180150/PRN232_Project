using BussinessObjects.Models;
using HomeHelperFinderAPI.Filters;
using HomeHelperFinderAPI.Hubs;
using HomeHelperFinderAPI.Services;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Implements;
using Repositories.Interfaces;
using Services.Implements;
using Services.Interfaces;
using Services.Mappers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(Program), typeof(NotificationProfile), typeof(ChatProfile), typeof(UserProfile), typeof(HelperProfile), typeof(ReportProfile));

builder.Services.AddDbContext<Prn232HomeHelperFinderSystemContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<Prn232HomeHelperFinderSystemContext>();
// Repository registrations
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IHelperRepository, HelperRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Service registrations
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IHelperService, HelperService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IProfileManagementService, ProfileManagementService>();
builder.Services.AddScoped<IConnectionManager, ConnectionManager>();
builder.Services.AddScoped<IRealtimeNotificationService, SignalRNotificationService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Add SignalR
builder.Services.AddSignalR();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://10.0.2.2:5000", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers(options => { options.Filters.Add<ApiResponseWrapperFilter>(); })
    .AddOData();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();