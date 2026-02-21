using Microsoft.EntityFrameworkCore;
using MyCash.API.Models;

namespace MyCash.API.Data;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }
    }
