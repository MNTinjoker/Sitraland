using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Services.Implementations;

namespace SitraLand_Api.Tests;

public class ProductsServiceTests
{
    private static ProductsService CreateService(TestDatabase database)
    {
        return new ProductsService(new FakeImageService(), database.Context);
    }

    private static Product CreateProduct(int id, string name, int price, int count, int? categoryId = null)
    {
        return new Product
        {
            ProductId = id,
            ProductName = name,
            ProductDescription = name + " description",
            Price = price,
            Count = count,
            IsActive = true,
            CategoryId = categoryId
        };
    }

    [Fact]
    public async Task DeleteCategory_RefusesWhenCategoryHasProducts()
    {
        using var database = new TestDatabase();
        database.Context.Categories.Add(new Category { CategoryId = 5, CategoryTitle = "Books" });
        database.Context.Products.Add(CreateProduct(1, "Book", 1000, 3, 5));
        await database.Context.SaveChangesAsync();

        var service = CreateService(database);

        var result = await service.DeleteCategory(5);

        Assert.Equal(409, result.Code);
        Assert.True(await database.Context.Categories.AnyAsync(c => c.CategoryId == 5));
    }

    [Fact]
    public async Task DeleteCategory_RemovesEmptyCategory()
    {
        using var database = new TestDatabase();
        database.Context.Categories.Add(new Category { CategoryId = 5, CategoryTitle = "Books" });
        await database.Context.SaveChangesAsync();

        var service = CreateService(database);

        var result = await service.DeleteCategory(5);

        Assert.Equal(200, result.Code);
        Assert.False(await database.Context.Categories.AnyAsync(c => c.CategoryId == 5));
    }

    [Fact]
    public async Task GetProducts_ReturnsRequestedPageAndTotalCount()
    {
        using var database = new TestDatabase();
        for (var i = 1; i <= 15; i++)
        {
            database.Context.Products.Add(CreateProduct(i, "Product " + i, i * 100, i));
        }
        await database.Context.SaveChangesAsync();

        var service = CreateService(database);

        var result = await service.GetProducts(page: 2, pageSize: 10);

        Assert.Equal(15, result.TotalCount);
        Assert.Equal(5, ((System.Collections.IEnumerable)result.Data!).Cast<object>().Count());
    }

    [Fact]
    public async Task GetProducts_FiltersBySearchTerm()
    {
        using var database = new TestDatabase();
        database.Context.Products.AddRange(
            CreateProduct(1, "Laptop", 1000, 1),
            CreateProduct(2, "Phone", 2000, 1));
        await database.Context.SaveChangesAsync();

        var service = CreateService(database);

        var result = await service.GetProducts(page: 1, pageSize: 10, search: "Lap");

        Assert.Equal(1, result.TotalCount);
    }

    [Fact]
    public async Task GetProduct_ReturnsListShapedDataForTheFrontendContract()
    {
        using var database = new TestDatabase();
        database.Context.Products.Add(CreateProduct(7, "Laptop", 1000, 4));
        await database.Context.SaveChangesAsync();

        var service = CreateService(database);

        var result = await service.GetProduct(7);

        Assert.Single(((System.Collections.IEnumerable)result.Data!).Cast<object>());
    }

    [Fact]
    public async Task SaveCategory_CreatesAndUpdatesRows()
    {
        using var database = new TestDatabase();
        var service = CreateService(database);

        var created = await service.SaveCategory(new SaveCategoryDTO { EditOrNewId = -1, CategoryTitle = "Books" });
        Assert.Equal(200, created.Code);

        var category = await database.Context.Categories.SingleAsync();
        var updated = await service.SaveCategory(new SaveCategoryDTO { EditOrNewId = category.CategoryId!.Value, CategoryTitle = "Novels" });
        Assert.Equal("Updated", updated.Message);

        var reloaded = await database.Context.Categories.AsNoTracking().SingleAsync();
        Assert.Equal("Novels", reloaded.CategoryTitle);
    }
}
