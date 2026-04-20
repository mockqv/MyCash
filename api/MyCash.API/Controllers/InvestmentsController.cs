using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.Investments;
using MyCash.API.Enums;
using MyCash.API.Extensions;
using MyCash.API.Models;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvestmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public InvestmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetInvestments()
    {
        var userId = User.GetUserId();
        var investments = await _context.Investments
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.CreatedAt)
            .Select(i => new InvestmentResponseDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                Amount = i.Amount,
                Color = i.Color,
                Icon = i.Icon,
                CreatedAt = i.CreatedAt
            })
            .ToListAsync();

        return Ok(investments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvestment([FromBody] CreateInvestmentRequest request)
    {
        var userId = User.GetUserId();

        if (request.Amount > 0)
        {
            var available = await GetAvailableBalance(userId, null);
            if (request.Amount > available)
                return BadRequest(new { message = "Saldo insuficiente para investir esse valor." });
        }

        var investment = new Investment
        {
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            Amount = request.Amount,
            Color = request.Color,
            Icon = request.Icon
        };

        _context.Investments.Add(investment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInvestments), new { id = investment.Id }, ToDto(investment));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvestment(Guid id, [FromBody] UpdateInvestmentRequest request)
    {
        var userId = User.GetUserId();
        var investment = await _context.Investments.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (investment == null) return NotFound();

        var delta = request.Amount - investment.Amount;
        if (delta > 0)
        {
            var available = await GetAvailableBalance(userId, id);
            if (delta > available)
                return BadRequest(new { message = "Saldo insuficiente para aumentar o investimento." });
        }

        investment.Name = request.Name;
        investment.Description = request.Description;
        investment.Amount = request.Amount;
        investment.Color = request.Color;
        investment.Icon = request.Icon;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvestment(Guid id)
    {
        var userId = User.GetUserId();
        var investment = await _context.Investments.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (investment == null) return NotFound();

        _context.Investments.Remove(investment);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<decimal> GetAvailableBalance(Guid userId, Guid? excludeInvestmentId)
    {
        var totalIncome = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == TransactionType.Income)
            .SumAsync(t => t.Amount);

        var totalExpense = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == TransactionType.Expense)
            .SumAsync(t => t.Amount);

        var allocatedToGoals = await _context.Goals
            .Where(g => g.UserId == userId)
            .SumAsync(g => g.AllocatedAmount);

        var investmentsQuery = _context.Investments.Where(i => i.UserId == userId);
        if (excludeInvestmentId.HasValue)
            investmentsQuery = investmentsQuery.Where(i => i.Id != excludeInvestmentId.Value);
        var allocatedToInvestments = await investmentsQuery.SumAsync(i => i.Amount);

        return (totalIncome - totalExpense) - allocatedToGoals - allocatedToInvestments;
    }

    private static InvestmentResponseDto ToDto(Investment i) => new()
    {
        Id = i.Id,
        Name = i.Name,
        Description = i.Description,
        Amount = i.Amount,
        Color = i.Color,
        Icon = i.Icon,
        CreatedAt = i.CreatedAt
    };
}
