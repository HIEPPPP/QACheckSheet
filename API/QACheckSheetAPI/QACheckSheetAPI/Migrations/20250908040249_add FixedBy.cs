using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QACheckSheetAPI.Migrations
{
    /// <inheritdoc />
    public partial class addFixedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FixedBy",
                table: "NGDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FixedBy",
                table: "NGDetails");
        }
    }
}
