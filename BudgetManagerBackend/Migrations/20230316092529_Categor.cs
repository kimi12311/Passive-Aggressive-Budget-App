using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetManagerBackend.Migrations
{
    /// <inheritdoc />
    public partial class Categor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Budget",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Budget",
                table: "Users");
        }
    }
}
