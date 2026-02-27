using MyCash.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class Transaction
{
    public Guid Id { get; set; }
    [Required]
    public Guid UserId { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; } = TransactionCategory.Outros;
}