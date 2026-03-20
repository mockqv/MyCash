using MyCash.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace MyCash.API.DTOs.ScheduledTransactions;

public class UpdateScheduledTransactionRequest
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; }

    [Range(1, 31, ErrorMessage = "DayOfMonth must be between 1 and 31.")]
    public int DayOfMonth { get; set; }

    public bool IsActive { get; set; }

    public Guid? CustomCategoryId { get; set; }
}