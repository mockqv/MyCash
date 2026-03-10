using MyCash.API.Enums;

namespace MyCash.API.Models;

public class ScheduledOccurrence
{
    public Guid Id { get; set; }
    public Guid ScheduledTransactionId { get; set; }
    public ScheduledTransaction ScheduledTransaction { get; set; } = null!;
    public Guid UserId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public OccurrenceStatus Status { get; set; } = OccurrenceStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}