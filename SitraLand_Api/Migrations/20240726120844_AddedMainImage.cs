using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedMainImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MainImage",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MainImageName",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MainImagePath",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainImage",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MainImageName",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MainImagePath",
                table: "Products");
        }
    }
}
