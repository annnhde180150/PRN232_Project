namespace BussinessObjects.Models;

public class WalletTransaction
{
    public long TransactionId { get; set; }

    public int WalletId { get; set; }

    public int? BookingId { get; set; }

    public int? WithdrawalRequestId { get; set; }

    public string TransactionType { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime? TransactionDate { get; set; }

    public string? Description { get; set; }

    public string? ReferenceTransactionId { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual HelperWallet Wallet { get; set; } = null!;

    public virtual WithdrawalRequest? WithdrawalRequest { get; set; }
}