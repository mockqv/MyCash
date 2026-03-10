using MyCash.API.Enums;
using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class ScheduledTransaction
{
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionCategory Category { get; set; } = TransactionCategory.Outros;
    public RecurrenceType Recurrence { get; set; } = RecurrenceType.Monthly;
    public int DayOfMonth { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}