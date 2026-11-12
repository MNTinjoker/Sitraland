using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    public partial class AddedChangesForDebug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "36dffdf5-7b9c-40bc-ad1b-a4c4c7f8610d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f34d622b-8dd7-46a6-b810-07ba228bc951");

            migrationBuilder.AddColumn<string>(
                name: "ImageFolderPath",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0330de0c-74a9-42cf-a66f-f86f51c7768c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "601dac8f-d388-4b2d-ac41-c77d2d1a793a");

            migrationBuilder.DropColumn(
                name: "ImageFolderPath",
                table: "Categories");
        }
    }
}
