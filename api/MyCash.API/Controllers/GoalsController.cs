using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.Goals;
using MyCash.API.Enums;
using MyCash.API.Extensions;
using MyCash.API.Models;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GoalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetGoals()
    {
        var userId = User.GetUserId();
        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderBy(g => g.CreatedAt)
            .Select(g => new GoalResponseDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                TargetAmount = g.TargetAmount,
                AllocatedAmount = g.AllocatedAmount,
                Deadline = g.Deadline,
                Color = g.Color,
                Icon = g.Icon,
                IsCompleted = g.IsCompleted,
                CreatedAt = g.CreatedAt
            })
            .ToListAsync();

        return Ok(goals);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGoal([FromBody] CreateGoalRequest request)
    {
        var userId = User.GetUserId();

        if (request.InitialAllocation > 0)
        {
            var available = await GetAvailableBalance(userId, null, null);
            if (request.InitialAllocation > available)
                return BadRequest(new { message = "Saldo insuficiente para alocar esse valor." });
        }

        var goal = new Goal
        {
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            TargetAmount = request.TargetAmount,
            AllocatedAmount = request.InitialAllocation,
            Deadline = request.Deadline,
            Color = request.Color,
            Icon = request.Icon
        };

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, ToDto(goal));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGoal(Guid id, [FromBody] UpdateGoalRequest request)
    {
        var userId = User.GetUserId();
        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        if (goal == null) return NotFound();

        goal.Name = request.Name;
        goal.Description = request.Description;
        goal.TargetAmount = request.TargetAmount;
        goal.Deadline = request.Deadline;
        goal.Color = request.Color;
        goal.Icon = request.Icon;
        goal.IsCompleted = request.IsCompleted;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/allocate")]
    public async Task<IActionResult> AllocateGoal(Guid id, [FromBody] AllocateGoalRequest request)
    {
        var userId = User.GetUserId();
        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        if (goal == null) return NotFound();

        if (request.AllocatedAmount < 0)
            return BadRequest(new { message = "O valor alocado não pode ser negativo." });

        var delta = request.AllocatedAmount - goal.AllocatedAmount;
        if (delta > 0)
        {
            var available = await GetAvailableBalance(userId, id, null);
            if (delta > available)
                return BadRequest(new { message = "Saldo insuficiente para alocar esse valor." });
        }

        goal.AllocatedAmount = request.AllocatedAmount;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(Guid id)
    {
        var userId = User.GetUserId();
        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        if (goal == null) return NotFound();

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<decimal> GetAvailableBalance(Guid userId, Guid? excludeGoalId, Guid? excludeInvestmentId)
    {
        var totalIncome = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == TransactionType.Income)
            .SumAsync(t => t.Amount);

        var totalExpense = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == TransactionType.Expense)
            .SumAsync(t => t.Amount);

        var goalsQuery = _context.Goals.Where(g => g.UserId == userId);
        if (excludeGoalId.HasValue)
            goalsQuery = goalsQuery.Where(g => g.Id != excludeGoalId.Value);
        var allocatedToGoals = await goalsQuery.SumAsync(g => g.AllocatedAmount);

        var investmentsQuery = _context.Investments.Where(i => i.UserId == userId);
        if (excludeInvestmentId.HasValue)
            investmentsQuery = investmentsQuery.Where(i => i.Id != excludeInvestmentId.Value);
        var allocatedToInvestments = await investmentsQuery.SumAsync(i => i.Amount);

        return (totalIncome - totalExpense) - allocatedToGoals - allocatedToInvestments;
    }

    private static GoalResponseDto ToDto(Goal g) => new()
    {
        Id = g.Id,
        Name = g.Name,
        Description = g.Description,
        TargetAmount = g.TargetAmount,
        AllocatedAmount = g.AllocatedAmount,
        Deadline = g.Deadline,
        Color = g.Color,
        Icon = g.Icon,
        IsCompleted = g.IsCompleted,
        CreatedAt = g.CreatedAt
    };
}
