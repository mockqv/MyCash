using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCash.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomCategoryId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CustomCategoryId",
                table: "Transactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CustomCategoryId",
                table: "ScheduledTransactions",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomCategoryId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CustomCategoryId",
                table: "ScheduledTransactions");
        }
    }
}
