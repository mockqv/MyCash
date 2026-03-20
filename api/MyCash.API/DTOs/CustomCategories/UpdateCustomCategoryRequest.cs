using System.ComponentModel.DataAnnotations;

namespace MyCash.API.DTOs.CustomCategories;

public class UpdateCustomCategoryRequest
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Color { get; set; } = "#71717a";

    [Required]
    [MaxLength(50)]
    public string Icon { get; set; } = "Tag";
}
