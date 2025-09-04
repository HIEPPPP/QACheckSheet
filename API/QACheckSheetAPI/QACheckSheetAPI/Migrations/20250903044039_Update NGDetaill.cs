using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QACheckSheetAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNGDetaill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NGDetail",
                table: "CheckResults");

            migrationBuilder.AddColumn<string>(
                name: "NGContentDetail",
                table: "NGDetails",
                type: "nvarchar(700)",
                maxLength: 700,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NGContentDetail",
                table: "NGDetails");

            migrationBuilder.AddColumn<string>(
                name: "NGDetail",
                table: "CheckResults",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
