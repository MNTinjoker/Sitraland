using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    public partial class UndoChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "488c571e-928f-4419-b8be-8f63c8642b1e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "65ee613e-6aed-45f3-9bc6-e2cf0bf6c51d");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "488c571e-928f-4419-b8be-8f63c8642b1e", "cc1b79dd-908d-4684-a5a8-84428fd0869b", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "65ee613e-6aed-45f3-9bc6-e2cf0bf6c51d", "77ea6584-5ed3-4340-a338-40329bce779b", "Admin", "ADMIN" });
        }
    }
}
