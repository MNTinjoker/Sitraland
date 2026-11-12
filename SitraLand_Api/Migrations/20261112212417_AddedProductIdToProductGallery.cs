using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SitraLand_Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedProductIdToProductGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "ProductGallerys",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProductGallerys_ProductId",
                table: "ProductGallerys",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductGallerys_ProductId",
                table: "ProductGallerys");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "ProductGallerys");
        }
    }
}
