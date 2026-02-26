using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class Transaction
{
    public Guid Id { get; set; }
    [Required]
    public string UserId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public TransactionType Type { get; set; }
}

public enum TransactionType
{
    Income,
    Expense
}