using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Services.Interfaces;
using System.Net;
using System.Security.Cryptography;

namespace SitraLand_Api.Services.Implementations
{
    public class BasketService : IBasketService
    {
        private const int MaxBasketItems = 100;
        private const int MaxBasketProductsLookup = 100;

        private readonly DatabaseContext _dbContext;

        public BasketService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ResponseGlobal> SaveBasket(SaveBasketDTO model)
        {
            var result = new ResponseGlobal();

            if (model.ProductId == null || model.ProductId.Length == 0 ||
                model.Count == null || model.Count.Length != model.ProductId.Length)
            {
                return InvalidBasketResult("Invalid products list");
            }

            if (model.ProductId.Length > MaxBasketItems)
            {
                return InvalidBasketResult($"A basket cannot contain more than {MaxBasketItems} items");
            }

            if (model.ProductId.Any(id => id < 1) || model.Count.Any(count => count < 1))
            {
                return InvalidBasketResult("Invalid product or quantity");
            }

            if (model.ProductId.Distinct().Count() != model.ProductId.Length)
            {
                return InvalidBasketResult("Duplicate products are not allowed");
            }

            var productIds = model.ProductId;
            var products = await _dbContext.Products.AsNoTracking()
                .Where(p => productIds.Contains(p.ProductId))
                .Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    p.Price,
                    p.Count
                })
                .ToListAsync();

            if (products.Count != productIds.Length)
            {
                return InvalidBasketResult("One or more products no longer exist");
            }

            var productsById = products.ToDictionary(p => p.ProductId);

            long totalPrice = 0;
            var titles = new List<string>(productIds.Length);
            var remainingCounts = new int[productIds.Length];

            for (var i = 0; i < productIds.Length; i++)
            {
                var product = productsById[productIds[i]];
                var quantity = model.Count[i];

                if (product.Count < quantity)
                {
                    result.Message = $"Not enough stock for '{product.ProductName}'";
                    result.Code = (int)HttpStatusCode.Conflict;
                    return result;
                }

                totalPrice += (long)product.Price * quantity;
                titles.Add(product.ProductName);
                remainingCounts[i] = product.Count - quantity;
            }

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            // Decrement stock atomically: the guard in the WHERE clause prevents overselling
            // when two orders compete for the same product.
            for (var i = 0; i < productIds.Length; i++)
            {
                var quantity = model.Count[i];
                var affected = await _dbContext.Products
                    .Where(p => p.ProductId == productIds[i] && p.Count >= quantity)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.Count, x => x.Count - quantity));

                if (affected != 1)
                {
                    await transaction.RollbackAsync();

                    result.Message = $"Not enough stock for '{productsById[productIds[i]].ProductName}'";
                    result.Code = (int)HttpStatusCode.Conflict;
                    return result;
                }
            }

            var basketCode = await GenerateUniqueBasketCodeAsync();

            var basket = new Basket
            {
                Name = model.Name,
                LastName = model.LastName,
                Address = model.Address,
                NationalCode = model.NationalCode,
                Count = model.Count,
                ProductId = model.ProductId,
                Mobile = model.Mobile,
                Status = 0,
                BasketCode = basketCode,
                Ostan = model.Ostan,
                Tozihat = model.Tozihat,
                Titles = string.Join(',', titles),
                LastCount = remainingCounts,
                BasketDate = string.IsNullOrWhiteSpace(model.BasketDate)
                    ? DateTime.Now.ToString("yyyy/MM/dd")
                    : model.BasketDate,
                TotalPrice = totalPrice
            };

            await _dbContext.Baskets.AddAsync(basket);
            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            result.Message = basketCode;
            result.Code = (int)HttpStatusCode.OK;
            result.Data = totalPrice;
            return result;
        }

        public async Task<ResponseGlobal> GetAllBasket(int page = 1, int pageSize = 10, int? status = null, string? search = null)
        {
            var result = new ResponseGlobal();

            page = page < 1 ? 1 : page;
            pageSize = pageSize is < 1 or > 200 ? 10 : pageSize;

            var query = _dbContext.Baskets.AsNoTracking();

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(b =>
                    b.BasketCode != null && b.BasketCode.Contains(term) ||
                    b.Name.Contains(term) ||
                    b.LastName.Contains(term) ||
                    b.Mobile.Contains(term) ||
                    b.Ostan.Contains(term));
            }

            var totalCount = await query.CountAsync();

            var baskets = await query
                .OrderByDescending(b => b.BasketId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.TotalCount = totalCount;
            result.Data = baskets;
            return result;
        }

        public async Task<List<object>> GetBasketProducts(int[] products)
        {
            if (products == null || products.Length == 0 || products.Length > MaxBasketProductsLookup)
            {
                return new List<object>();
            }

            var ids = products.Where(id => id > 0).Distinct().ToArray();
            if (ids.Length == 0)
            {
                return new List<object>();
            }

            // Single query for all requested products instead of one query per product.
            var rows = await _dbContext.Products.AsNoTracking()
                .Where(x => ids.Contains(x.ProductId))
                .Select(p => new
                {
                    p.Count,
                    p.ProductDescription,
                    p.ExtraDetails,
                    p.ProductId,
                    p.ImageFolderPath,
                    p.IsActive,
                    p.ProductName,
                    p.Price,
                    p.CategoryId
                })
                .ToListAsync();

            var rowsById = rows.ToDictionary(r => r.ProductId);

            // The client relies on an array of single-item arrays, in the same order as the request.
            var result = new List<object>(products.Length);
            foreach (var id in products)
            {
                var item = new List<object>();
                if (rowsById.TryGetValue(id, out var row))
                {
                    item.Add(row);
                }

                result.Add(item);
            }

            return result;
        }

        public async Task<ResponseGlobal> GetBasket(string basketCode)
        {
            var result = new ResponseGlobal();

            var basket = await _dbContext.Baskets.AsNoTracking()
                .FirstOrDefaultAsync(q => q.BasketCode == basketCode);

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = basket;
            return result;
        }

        public async Task<ResponseGlobal> UpdateBasket(int basketId, UpdateBasketDTO model)
        {
            var result = new ResponseGlobal();

            var basket = await _dbContext.Baskets.FirstOrDefaultAsync(q => q.BasketId == basketId);
            if (basket == null)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            basket.Status = model.Status;

            await _dbContext.SaveChangesAsync();

            result.Message = "Success";
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> DeleteBasket(int basketId)
        {
            var result = new ResponseGlobal();

            if (basketId < 1)
            {
                result.Message = "Invalid Body Request";
                return result;
            }

            var affected = await _dbContext.Baskets
                .Where(b => b.BasketId == basketId)
                .ExecuteDeleteAsync();

            if (affected == 0)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            result.Message = "Success";
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> SendOrderConfirm(string basketCode)
        {
            var result = new ResponseGlobal();

            var affected = await _dbContext.Baskets
                .Where(b => b.BasketCode == basketCode)
                .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.Status, 1));

            if (affected == 0)
            {
                result.Message = "Submitted Data Is Invalid";
                result.Code = (int)HttpStatusCode.NotFound;
                return result;
            }

            result.Message = "Confirmed Send This Order";
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        private static ResponseGlobal InvalidBasketResult(string message)
        {
            return new ResponseGlobal
            {
                Message = message,
                Code = (int)HttpStatusCode.BadRequest
            };
        }

        private async Task<string> GenerateUniqueBasketCodeAsync()
        {
            for (var attempt = 0; attempt < 20; attempt++)
            {
                var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
                if (!await _dbContext.Baskets.AnyAsync(b => b.BasketCode == code))
                {
                    return code;
                }
            }

            throw new InvalidOperationException("Could not generate a unique basket code.");
        }
    }
}
