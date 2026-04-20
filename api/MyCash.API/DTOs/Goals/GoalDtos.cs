namespace MyCash.API.DTOs.Goals;

public class GoalResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public decimal AllocatedAmount { get; set; }
    public DateTime? Deadline { get; set; }
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateGoalRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public decimal InitialAllocation { get; set; }
    public DateTime? Deadline { get; set; }
    public string Color { get; set; } = "#3b82f6";
    public string Icon { get; set; } = "Target";
}

public class UpdateGoalRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TargetAmount { get; set; }
    public DateTime? Deadline { get; set; }
    public string Color { get; set; } = "#3b82f6";
    public string Icon { get; set; } = "Target";
    public bool IsCompleted { get; set; }
}

public class AllocateGoalRequest
{
    public decimal AllocatedAmount { get; set; }
}
