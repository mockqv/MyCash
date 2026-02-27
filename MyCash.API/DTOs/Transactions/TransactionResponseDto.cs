using MyCash.API.Enums;

namespace MyCash.API.DTOs.Transactions;

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; }
}