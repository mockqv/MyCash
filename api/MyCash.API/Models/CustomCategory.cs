using System.ComponentModel.DataAnnotations;

namespace MyCash.API.Models;

public class CustomCategory
{
    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Color { get; set; } = "#71717a";

    [Required]
    [MaxLength(50)]
    public string Icon { get; set; } = "Tag";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
