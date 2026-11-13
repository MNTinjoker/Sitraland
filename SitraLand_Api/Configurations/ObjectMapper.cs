using SitraLand_Api.Data;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;

namespace SitraLand_Api.Configurations
{
    /// <summary>
    /// Plain object mappings, written by hand so that the project does not depend on a
    /// commercial mapping library.
    /// </summary>
    public static class ObjectMapper
    {
        public static Product ToProduct(this SaveProductsDTO model)
        {
            return new Product
            {
                ProductName = model.ProductName,
                ProductDescription = model.ProductDescription,
                Price = model.Price,
                Count = model.Count,
                IsActive = model.IsActive,
                ExtraDetails = model.ExtraDetails,
                // The image is stored on disk and referenced by ImageFolderPath; do not persist base64.
                Image = null,
                ImageName = null,
                CategoryId = model.CategoryId,
                ImageFolderPath = model.ImageFolderPath
            };
        }

        public static void MapTo(this SaveProductsDTO model, Product product)
        {
            product.ProductName = model.ProductName;
            product.ProductDescription = model.ProductDescription;
            product.Price = model.Price;
            product.Count = model.Count;
            product.IsActive = model.IsActive;
            product.ExtraDetails = model.ExtraDetails;
            // Keep base64 upload data out of the database; the saved file path is the source of truth.
            product.Image = null;
            product.ImageName = null;
            product.CategoryId = model.CategoryId;
            product.ImageFolderPath = model.ImageFolderPath;
        }

        public static Category ToCategory(this SaveCategoryDTO model)
        {
            return new Category
            {
                CategoryTitle = model.CategoryTitle
            };
        }

        public static void MapTo(this SaveCategoryDTO model, Category category)
        {
            category.CategoryTitle = model.CategoryTitle;
        }
    }
}
