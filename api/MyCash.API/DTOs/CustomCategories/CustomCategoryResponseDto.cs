namespace MyCash.API.DTOs.CustomCategories;

public class CustomCategoryResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Type { get; set; }
    public DateTime CreatedAt { get; set; }
}
