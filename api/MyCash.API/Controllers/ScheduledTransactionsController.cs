using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.ScheduledTransactions;
using MyCash.API.DTOs.Transactions;
using MyCash.API.Extensions;
using MyCash.API.Models;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScheduledTransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ScheduledTransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();
        var scheduled = await _context.ScheduledTransactions
            .Where(s => s.UserId == userId)
            .OrderBy(s => s.DayOfMonth)
            .Select(s => new ScheduledTransactionResponseDto
            {
                Id = s.Id,
                Description = s.Description,
                Amount = s.Amount,
                Type = s.Type,
                Category = s.Category,
                Recurrence = s.Recurrence,
                DayOfMonth = s.DayOfMonth,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();

        return Ok(scheduled);
    }

    [HttpGet("due-today")]
    public async Task<IActionResult> GetDueToday()
    {
        var userId = User.GetUserId();
        var today = DateTime.UtcNow;
        var daysInMonth = DateTime.DaysInMonth(today.Year, today.Month);

        var due = await _context.ScheduledTransactions
            .Where(s =>
                s.UserId == userId &&
                s.IsActive &&
                (
                    s.DayOfMonth == today.Day ||
                    (today.Day == daysInMonth && s.DayOfMonth > daysInMonth)
                )
            )
            .Select(s => new ScheduledTransactionResponseDto
            {
                Id = s.Id,
                Description = s.Description,
                Amount = s.Amount,
                Type = s.Type,
                Category = s.Category,
                Recurrence = s.Recurrence,
                DayOfMonth = s.DayOfMonth,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt
            })
            .ToListAsync();

        return Ok(due);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateScheduledTransactionRequest request)
    {
        var scheduled = new ScheduledTransaction
        {
            UserId = User.GetUserId(),
            Description = request.Description,
            Amount = request.Amount,
            Type = request.Type,
            Category = request.Category,
            Recurrence = request.Recurrence,
            DayOfMonth = request.DayOfMonth,
        };

        _context.ScheduledTransactions.Add(scheduled);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = scheduled.Id }, new ScheduledTransactionResponseDto
        {
            Id = scheduled.Id,
            Description = scheduled.Description,
            Amount = scheduled.Amount,
            Type = scheduled.Type,
            Category = scheduled.Category,
            Recurrence = scheduled.Recurrence,
            DayOfMonth = scheduled.DayOfMonth,
            IsActive = scheduled.IsActive,
            CreatedAt = scheduled.CreatedAt
        });
    }

    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var userId = User.GetUserId();
        var scheduled = await _context.ScheduledTransactions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (scheduled == null) return NotFound();

        var transaction = new Transaction
        {
            UserId = userId,
            Description = scheduled.Description,
            Amount = scheduled.Amount,
            Date = DateTime.UtcNow,
            Type = scheduled.Type,
            Category = scheduled.Category,
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(new TransactionResponseDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Date = transaction.Date,
            Type = transaction.Type,
            Category = transaction.Category,
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateScheduledTransactionRequest request)
    {
        var userId = User.GetUserId();
        var scheduled = await _context.ScheduledTransactions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (scheduled == null) return NotFound();

        scheduled.Description = request.Description;
        scheduled.Amount = request.Amount;
        scheduled.Type = request.Type;
        scheduled.Category = request.Category;
        scheduled.DayOfMonth = request.DayOfMonth;
        scheduled.IsActive = request.IsActive;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.GetUserId();
        var scheduled = await _context.ScheduledTransactions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (scheduled == null) return NotFound();

        _context.ScheduledTransactions.Remove(scheduled);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}