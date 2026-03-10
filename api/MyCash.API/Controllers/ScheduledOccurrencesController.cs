using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.ScheduledOccurrences;
using MyCash.API.DTOs.Transactions;
using MyCash.API.Enums;
using MyCash.API.Extensions;
using MyCash.API.Models;
using MyCash.API.Services;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScheduledOccurrencesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly OccurrenceGeneratorService _generatorService;

    public ScheduledOccurrencesController(
        AppDbContext context,
        OccurrenceGeneratorService generatorService)
    {
        _context = context;
        _generatorService = generatorService;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var userId = User.GetUserId();

        await _generatorService.GenerateOccurrencesAsync();

        var pending = await _context.ScheduledOccurrences
            .Include(o => o.ScheduledTransaction)
            .Where(o =>
                o.UserId == userId &&
                o.Status == OccurrenceStatus.Pending)
            .OrderBy(o => o.ScheduledTransaction.DayOfMonth)
            .Select(o => new ScheduledOccurrenceDto
            {
                Id = o.Id,
                ScheduledTransactionId = o.ScheduledTransactionId,
                Description = o.ScheduledTransaction.Description,
                Amount = o.ScheduledTransaction.Amount,
                Type = o.ScheduledTransaction.Type,
                Category = o.ScheduledTransaction.Category,
                DayOfMonth = o.ScheduledTransaction.DayOfMonth,
                Month = o.Month,
                Year = o.Year,
                Status = o.Status,
            })
            .ToListAsync();

        return Ok(pending);
    }

    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var userId = User.GetUserId();

        var occurrence = await _context.ScheduledOccurrences
            .Include(o => o.ScheduledTransaction)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (occurrence == null) return NotFound();
        if (occurrence.Status != OccurrenceStatus.Pending)
            return BadRequest("Esta occurrence já foi processada.");

        var transaction = new Transaction
        {
            UserId = userId,
            Description = occurrence.ScheduledTransaction.Description,
            Amount = occurrence.ScheduledTransaction.Amount,
            Date = DateTime.UtcNow,
            Type = occurrence.ScheduledTransaction.Type,
            Category = occurrence.ScheduledTransaction.Category,
        };

        occurrence.Status = OccurrenceStatus.Confirmed;

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

    [HttpPost("{id}/skip")]
    public async Task<IActionResult> Skip(Guid id)
    {
        var userId = User.GetUserId();

        var occurrence = await _context.ScheduledOccurrences
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (occurrence == null) return NotFound();
        if (occurrence.Status != OccurrenceStatus.Pending)
            return BadRequest("Esta occurrence já foi processada.");

        occurrence.Status = OccurrenceStatus.Skipped;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}