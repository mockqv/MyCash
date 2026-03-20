using MyCash.API.Enums;

namespace MyCash.API.DTOs.ScheduledTransactions;

public class ScheduledTransactionResponseDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; }
    public Guid? CustomCategoryId { get; set; }
    public RecurrenceType Recurrence { get; set; }
    public int DayOfMonth { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}