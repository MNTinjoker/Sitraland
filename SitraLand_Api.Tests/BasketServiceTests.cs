using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Services.Implementations;

namespace SitraLand_Api.Tests;

public class BasketServiceTests
{
    private static SaveBasketDTO CreateModel(int[] productIds, int[] counts)
    {
        return new SaveBasketDTO
        {
            Name = "Ali",
            LastName = "Rezaei",
            Address = "Tehran",
            NationalCode = 1234567890,
            Count = counts,
            ProductId = productIds,
            Mobile = "09120000000",
            Status = 0,
            Ostan = "Tehran",
            Titles = "client-supplied titles",
            LastCount = new int[counts.Length],
            BasketDate = "1403/01/01",
            TotalPrice = 999_999
        };
    }

    private static Product CreateProduct(int id, string name, int price, int count)
    {
        return new Product
        {
            ProductId = id,
            ProductName = name,
            ProductDescription = "desc",
            Price = price,
            Count = count,
            IsActive = true
        };
    }

    [Fact]
    public async Task SaveBasket_CalculatesPriceTitlesAndRemainingStockOnTheServer()
    {
        using var database = new TestDatabase();
        database.Context.Products.AddRange(
            CreateProduct(1, "Product A", 1000, 10),
            CreateProduct(2, "Product B", 2500, 5));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(new[] { 1, 2 }, new[] { 3, 2 }));

        Assert.Equal(200, result.Code);
        Assert.Equal(8000L, result.Data);
        Assert.Matches(@"^\d{6}$", result.Message);

        var basket = await database.Context.Baskets.SingleAsync();
        Assert.Equal(8000L, basket.TotalPrice);
        Assert.Equal("Product A,Product B", basket.Titles);
        Assert.Equal(new[] { 7, 3 }, basket.LastCount);
        Assert.Equal(new[] { 3, 2 }, basket.Count);
        Assert.Equal(0, basket.Status);

        // ExecuteUpdateAsync bypasses the change tracker, so read the persisted values back.
        database.Context.ChangeTracker.Clear();
        var products = await database.Context.Products.AsNoTracking().OrderBy(p => p.ProductId).ToListAsync();
        Assert.Equal(7, products[0].Count);
        Assert.Equal(3, products[1].Count);
    }

    [Fact]
    public async Task SaveBasket_RejectsQuantityAboveStockWithoutChangingAnything()
    {
        using var database = new TestDatabase();
        database.Context.Products.Add(CreateProduct(1, "Product A", 1000, 2));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(new[] { 1 }, new[] { 3 }));

        Assert.Equal(409, result.Code);
        Assert.Empty(database.Context.Baskets);
        Assert.Equal(2, (await database.Context.Products.SingleAsync()).Count);
    }

    [Fact]
    public async Task SaveBasket_RejectsUnknownProducts()
    {
        using var database = new TestDatabase();
        database.Context.Products.Add(CreateProduct(1, "Product A", 1000, 10));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(new[] { 1, 99 }, new[] { 1, 1 }));

        Assert.Equal(400, result.Code);
        Assert.Empty(database.Context.Baskets);
        Assert.Equal(10, (await database.Context.Products.SingleAsync()).Count);
    }

    [Theory]
    [InlineData(new[] { 1, 2 }, new[] { 1 })]
    [InlineData(new int[0], new int[0])]
    public async Task SaveBasket_RejectsInvalidArrays(int[] productIds, int[] counts)
    {
        using var database = new TestDatabase();
        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(productIds, counts));

        Assert.Equal(400, result.Code);
        Assert.Empty(database.Context.Baskets);
    }

    [Fact]
    public async Task SaveBasket_RejectsDuplicateProducts()
    {
        using var database = new TestDatabase();
        database.Context.Products.Add(CreateProduct(1, "Product A", 1000, 10));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(new[] { 1, 1 }, new[] { 1, 1 }));

        Assert.Equal(400, result.Code);
        Assert.Empty(database.Context.Baskets);
    }

    [Fact]
    public async Task SaveBasket_RejectsNonPositiveQuantity()
    {
        using var database = new TestDatabase();
        database.Context.Products.Add(CreateProduct(1, "Product A", 1000, 10));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.SaveBasket(CreateModel(new[] { 1 }, new[] { 0 }));

        Assert.Equal(400, result.Code);
        Assert.Equal(10, (await database.Context.Products.SingleAsync()).Count);
    }

    [Fact]
    public async Task GetBasketProducts_KeepsRequestOrderAndShape()
    {
        using var database = new TestDatabase();
        database.Context.Products.AddRange(
            CreateProduct(1, "Product A", 1000, 10),
            CreateProduct(2, "Product B", 2000, 10));
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var result = await service.GetBasketProducts(new[] { 2, 99, 1 });

        Assert.Equal(3, result.Count);
        Assert.Single((System.Collections.IEnumerable)result[0]);
        Assert.Empty((System.Collections.IEnumerable)result[1]!);
        Assert.Single((System.Collections.IEnumerable)result[2]);
    }

    [Fact]
    public async Task GetAllBasket_ReturnsPagedDataAndTotalCount()
    {
        using var database = new TestDatabase();
        for (var i = 0; i < 3; i++)
        {
            database.Context.Baskets.Add(new Basket
            {
                Name = "Name",
                LastName = "Last",
                Address = "Address",
                NationalCode = 1,
                Count = new[] { 1 },
                ProductId = new[] { 1 },
                Mobile = "09120000000",
                Status = i % 2,
                BasketCode = (100000 + i).ToString(),
                Ostan = "Tehran",
                Titles = "Product",
                LastCount = new[] { 1 },
                BasketDate = "1403/01/01",
                TotalPrice = 1000
            });
        }
        await database.Context.SaveChangesAsync();

        var service = new BasketService(database.Context);

        var page = await service.GetAllBasket(page: 2, pageSize: 2, status: null, search: null);
        Assert.Equal(3, page.TotalCount);
        Assert.Single((System.Collections.IEnumerable)page.Data);

        var unshipped = await service.GetAllBasket(page: 1, pageSize: 10, status: 0, search: null);
        Assert.Equal(2, unshipped.TotalCount);
    }
}
