using System.ComponentModel.DataAnnotations;

namespace MyCash.API.DTOs.CustomCategories;

public class CreateCustomCategoryRequest
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

    /// <summary>
    /// 0 = Receita, 1 = Despesa, 2 = Ambos
    /// </summary>
    public int Type { get; set; } = 2;
}
