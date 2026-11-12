using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    public partial class ChangeForImageNameLoad : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0b93f23f-1724-47c7-b4c7-01312aa0f3fd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4a02ed24-16fa-4d7c-98b0-bb455ee653bf");

            migrationBuilder.AddColumn<string>(
                name: "ImageFolderPath",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36dffdf5-7b9c-40bc-ad1b-a4c4c7f8610d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f34d622b-8dd7-46a6-b810-07ba228bc951");

            migrationBuilder.DropColumn(
                name: "ImageFolderPath",
                table: "Products");
        }
    }
}
