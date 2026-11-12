using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "ProductGallerys",
                columns: table => new
                {
                    ProductGalleryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageFolderPath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductGallerys", x => x.ProductGalleryId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductGallerys");

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
    }
}
