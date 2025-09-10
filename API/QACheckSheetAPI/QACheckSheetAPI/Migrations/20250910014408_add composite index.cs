using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QACheckSheetAPI.Migrations
{
    /// <inheritdoc />
    public partial class addcompositeindex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SheetCode",
                table: "CheckResults",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "DeviceCode",
                table: "CheckResults",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_CheckResult_Sheet_Device_CheckedDate",
                table: "CheckResults",
                columns: new[] { "SheetCode", "DeviceCode", "CheckedDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CheckResult_Sheet_Device_CheckedDate",
                table: "CheckResults");

            migrationBuilder.AlterColumn<string>(
                name: "SheetCode",
                table: "CheckResults",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "DeviceCode",
                table: "CheckResults",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
