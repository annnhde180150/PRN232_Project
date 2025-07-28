using System;

namespace Services.DTOs.Payment;

public class PaymentDetailsDto
{
    public int PaymentId { get; set; }
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public int HelperId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentStatus { get; set; } = null!;
    public DateTime? PaymentDate { get; set; }
    public string? TransactionId { get; set; }
    public string PaymentMethod { get; set; } = null!;
    
    // Booking information for context
    public string? BookingStatus { get; set; }
    public DateTime? ScheduledStartTime { get; set; }
    public DateTime? ScheduledEndTime { get; set; }

    public string? ServiceName { get; set; }
    public string? HelperName { get; set; }
} 