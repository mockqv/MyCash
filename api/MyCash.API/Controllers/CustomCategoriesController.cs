using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.DTOs.CustomCategories;
using MyCash.API.Extensions;
using MyCash.API.Models;

namespace MyCash.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomCategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserId();

        var categories = await _context.CustomCategories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .Select(c => new CustomCategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Color = c.Color,
                Icon = c.Icon,
                Type = c.Type,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomCategoryRequest request)
    {
        var userId = User.GetUserId();

        var category = new CustomCategory
        {
            UserId = userId,
            Name = request.Name,
            Color = request.Color,
            Icon = request.Icon,
            Type = request.Type
        };

        _context.CustomCategories.Add(category);
        await _context.SaveChangesAsync();

        var response = new CustomCategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color,
            Icon = category.Icon,
            Type = category.Type,
            CreatedAt = category.CreatedAt
        };

        return CreatedAtAction(nameof(GetAll), response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomCategoryRequest request)
    {
        var userId = User.GetUserId();
        var category = await _context.CustomCategories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null) return NotFound();

        category.Name = request.Name;
        category.Color = request.Color;
        category.Icon = request.Icon;
        category.Type = request.Type;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.GetUserId();
        var category = await _context.CustomCategories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null) return NotFound();

        _context.CustomCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
