using Microsoft.EntityFrameworkCore;
using MyCash.API.Models;

namespace MyCash.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<ScheduledTransaction> ScheduledTransactions { get; set; }
    public DbSet<ScheduledOccurrence> ScheduledOccurrences { get; set; }
    public DbSet<CustomCategory> CustomCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ScheduledOccurrence>()
            .HasOne(o => o.ScheduledTransaction)
            .WithMany()
            .HasForeignKey(o => o.ScheduledTransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScheduledOccurrence>()
            .HasIndex(o => new { o.ScheduledTransactionId, o.Month, o.Year })
            .IsUnique();
    }
}