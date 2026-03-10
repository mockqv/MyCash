using Microsoft.EntityFrameworkCore;
using MyCash.API.Data;
using MyCash.API.Enums;
using MyCash.API.Models;

namespace MyCash.API.Services;

public class OccurrenceGeneratorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<OccurrenceGeneratorService> _logger;

    public OccurrenceGeneratorService(
        IServiceScopeFactory scopeFactory,
        ILogger<OccurrenceGeneratorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = GetDelayUntilNextRun();
            _logger.LogInformation("OccurrenceGenerator: próxima execução em {Delay}", delay);
            await Task.Delay(delay, stoppingToken);

            if (!stoppingToken.IsCancellationRequested)
                await GenerateOccurrencesAsync(stoppingToken);
        }
    }

    private static TimeSpan GetDelayUntilNextRun()
    {
        var now = DateTime.UtcNow;
        var nextRun = now.Date.AddDays(1);
        return nextRun - now;
    }

    public async Task GenerateOccurrencesAsync(CancellationToken cancellationToken = default)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var today = DateTime.UtcNow;
        var month = today.Month;
        var year = today.Year;
        var daysInMonth = DateTime.DaysInMonth(year, month);

        var activeScheduled = await db.ScheduledTransactions
            .Where(s => s.IsActive)
            .ToListAsync(cancellationToken);

        var created = 0;

        foreach (var scheduled in activeScheduled)
        {
            bool isDueToday = scheduled.DayOfMonth == today.Day ||
                              (today.Day == daysInMonth && scheduled.DayOfMonth > daysInMonth);

            if (!isDueToday) continue;

            var alreadyExists = await db.ScheduledOccurrences
                .AnyAsync(o =>
                    o.ScheduledTransactionId == scheduled.Id &&
                    o.Month == month &&
                    o.Year == year,
                    cancellationToken);

            if (alreadyExists) continue;

            db.ScheduledOccurrences.Add(new ScheduledOccurrence
            {
                Id = Guid.NewGuid(),
                ScheduledTransactionId = scheduled.Id,
                UserId = scheduled.UserId,
                Month = month,
                Year = year,
                Status = OccurrenceStatus.Pending,
            });

            created++;
        }

        if (created > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("OccurrenceGenerator: {Count} occurrences criadas para {Month}/{Year}", created, month, year);
        }
    }
}