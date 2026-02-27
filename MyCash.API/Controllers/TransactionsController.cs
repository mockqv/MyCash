using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.Transactions;
using MyCash.API.Enums;
using MyCash.API.Extensions;
using MyCash.API.Models;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? month = null,
        [FromQuery] int? year = null)
    {
        var userId = User.GetUserId();
        var query = _context.Transactions.Where(t => t.UserId == userId).AsQueryable();

        if (month.HasValue && year.HasValue)
        {
            query = query.Where(t => t.Date.Month == month.Value && t.Date.Year == year.Value);
        }

        var totalItems = await query.CountAsync();

        var transactions = await query
            .OrderByDescending(t => t.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Amount,
                Date = t.Date,
                Type = t.Type,
                Category = t.Category
            })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            Items = transactions
        });
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] int? month = null,
        [FromQuery] int? year = null)
    {
        var userId = User.GetUserId();
        var query = _context.Transactions.Where(t => t.UserId == userId).AsQueryable();

        if (month.HasValue && year.HasValue)
        {
            query = query.Where(t => t.Date.Month == month.Value && t.Date.Year == year.Value);
        }

        var totalIncome = await query
            .Where(t => t.Type == TransactionType.Income)
            .SumAsync(t => t.Amount);

        var totalExpense = await query
            .Where(t => t.Type == TransactionType.Expense)
            .SumAsync(t => t.Amount);

        return Ok(new
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionRequest request)
    {
        var transaction = new Transaction
        {
            UserId = User.GetUserId(),
            Description = request.Description,
            Amount = request.Amount,
            Date = request.Date,
            Type = request.Type,
            Category = request.Category
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var responseDto = new TransactionResponseDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Date = transaction.Date,
            Type = transaction.Type,
            Category = transaction.Category
        };

        return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, responseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] UpdateTransactionRequest request)
    {
        var userId = User.GetUserId();
        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null) return NotFound();

        transaction.Description = request.Description;
        transaction.Amount = request.Amount;
        transaction.Date = request.Date;
        transaction.Type = request.Type;
        transaction.Category = request.Category;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var userId = User.GetUserId();
        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null) return NotFound();

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}