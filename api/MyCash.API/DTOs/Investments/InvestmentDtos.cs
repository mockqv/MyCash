namespace MyCash.API.DTOs.Investments;

public class InvestmentResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateInvestmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public string Color { get; set; } = "#8b5cf6";
    public string Icon { get; set; } = "TrendingUp";
}

public class UpdateInvestmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public string Color { get; set; } = "#8b5cf6";
    public string Icon { get; set; } = "TrendingUp";
}
