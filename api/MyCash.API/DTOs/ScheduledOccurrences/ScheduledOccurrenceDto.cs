using MyCash.API.Enums;

namespace MyCash.API.DTOs.ScheduledOccurrences;

public class ScheduledOccurrenceDto
{
    public Guid Id { get; set; }
    public Guid ScheduledTransactionId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; }
    public int DayOfMonth { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public OccurrenceStatus Status { get; set; }
}