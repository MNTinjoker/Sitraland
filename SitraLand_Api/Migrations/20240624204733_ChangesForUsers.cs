using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SitraLand_Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangesForUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6154811a-5a41-48b5-b52d-13848d4d511d", null, "Admin", "ADMIN" },
                    { "f8be96a2-fb9e-47c0-886c-bee783546adf", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6154811a-5a41-48b5-b52d-13848d4d511d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f8be96a2-fb9e-47c0-886c-bee783546adf");
        }
    }
}
