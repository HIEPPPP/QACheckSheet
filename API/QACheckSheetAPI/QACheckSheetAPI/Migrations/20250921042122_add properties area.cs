using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QACheckSheetAPI.Migrations
{
    /// <inheritdoc />
    public partial class addpropertiesarea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Devices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "Devices");
        }
    }
}
