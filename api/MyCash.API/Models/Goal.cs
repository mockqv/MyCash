using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class Goal
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    public decimal TargetAmount { get; set; }

    public decimal AllocatedAmount { get; set; }

    public DateTime? Deadline { get; set; }

    [MaxLength(20)]
    public string Color { get; set; } = "#3b82f6";

    [MaxLength(50)]
    public string Icon { get; set; } = "Target";

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
