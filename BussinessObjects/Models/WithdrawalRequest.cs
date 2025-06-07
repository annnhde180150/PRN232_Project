namespace BussinessObjects.Models;

public class WithdrawalRequest
{
    public int WithdrawalRequestId { get; set; }

    public int HelperId { get; set; }

    public int WalletId { get; set; }

    public decimal Amount { get; set; }

    public string RequestMethod { get; set; } = null!;

    public string AccountDetails { get; set; } = null!;

    public DateTime? RequestDate { get; set; }

    public string? Status { get; set; }

    public int? ProcessedByAdminId { get; set; }

    public DateTime? ProcessingDate { get; set; }

    public DateTime? CompletionDate { get; set; }

    public string? RejectionReason { get; set; }

    public string? BankTransactionId { get; set; }

    public string? Notes { get; set; }

    public virtual Helper Helper { get; set; } = null!;

    public virtual AdminUser? ProcessedByAdmin { get; set; }

    public virtual HelperWallet Wallet { get; set; } = null!;

    public virtual ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
}