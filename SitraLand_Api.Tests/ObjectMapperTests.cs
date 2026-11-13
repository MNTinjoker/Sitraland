using SitraLand_Api.Configurations;
using SitraLand_Api.Data;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;

namespace SitraLand_Api.Tests;

public class ObjectMapperTests
{
    [Fact]
    public void ToProduct_CopiesEveryField()
    {
        var model = new SaveProductsDTO
        {
            EditOrNewId = -1,
            ProductName = "پمپ آب",
            ProductDescription = "توضیحات",
            Price = 250000,
            Count = 3,
            IsActive = true,
            ExtraDetails = "جزئیات",
            Image = "base64",
            ImageName = "pump.png",
            CategoryId = 2,
            ImageFolderPath = "shop/2026"
        };

        var product = model.ToProduct();

        Assert.Equal(model.ProductName, product.ProductName);
        Assert.Equal(model.ProductDescription, product.ProductDescription);
        Assert.Equal(model.Price, product.Price);
        Assert.Equal(model.Count, product.Count);
        Assert.Equal(model.IsActive, product.IsActive);
        Assert.Equal(model.ExtraDetails, product.ExtraDetails);
        // Base64 upload data must not be persisted; the saved file path is the source of truth.
        Assert.Null(product.Image);
        Assert.Null(product.ImageName);
        Assert.Equal(model.CategoryId, product.CategoryId);
        Assert.Equal(model.ImageFolderPath, product.ImageFolderPath);
    }

    [Fact]
    public void MapTo_UpdatesTheExistingProduct()
    {
        var product = new Product
        {
            ProductId = 7,
            ProductName = "قدیمی",
            Price = 100,
            Count = 1,
            IsActive = false,
            Image = "old-base64",
            ImageName = "old.png"
        };

        var model = new SaveProductsDTO
        {
            EditOrNewId = 7,
            ProductName = "جدید",
            Price = 500,
            Count = 9,
            IsActive = true,
            CategoryId = 4,
            Image = "new-base64",
            ImageName = "new.png"
        };

        model.MapTo(product);

        Assert.Equal(7, product.ProductId);
        Assert.Equal("جدید", product.ProductName);
        Assert.Equal(500, product.Price);
        Assert.Equal(9, product.Count);
        Assert.True(product.IsActive);
        Assert.Equal(4, product.CategoryId);
        Assert.Null(product.Image);
        Assert.Null(product.ImageName);
    }

    [Fact]
    public void ToCategory_CopiesTheTitle()
    {
        var category = new SaveCategoryDTO { EditOrNewId = -1, CategoryTitle = "موتور" }.ToCategory();

        Assert.Equal("موتور", category.CategoryTitle);
        Assert.Null(category.CategoryId);
    }

    [Fact]
    public void MapTo_UpdatesTheExistingCategory()
    {
        var category = new Category { CategoryId = 3, CategoryTitle = "قدیمی" };

        new SaveCategoryDTO { EditOrNewId = 3, CategoryTitle = "گیربکس" }.MapTo(category);

        Assert.Equal(3, category.CategoryId);
        Assert.Equal("گیربکس", category.CategoryTitle);
    }
}
