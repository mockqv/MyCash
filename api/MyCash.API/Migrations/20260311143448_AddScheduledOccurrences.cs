using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCash.API.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduledOccurrences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScheduledOccurrences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduledTransactionId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Month = table.Column<int>(type: "integer", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduledOccurrences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduledOccurrences_ScheduledTransactions_ScheduledTransac~",
                        column: x => x.ScheduledTransactionId,
                        principalTable: "ScheduledTransactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledOccurrences_ScheduledTransactionId_Month_Year",
                table: "ScheduledOccurrences",
                columns: new[] { "ScheduledTransactionId", "Month", "Year" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScheduledOccurrences");
        }
    }
}
