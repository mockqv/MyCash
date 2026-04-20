using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class Investment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(20)]
    public string Color { get; set; } = "#8b5cf6";

    [MaxLength(50)]
    public string Icon { get; set; } = "TrendingUp";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
