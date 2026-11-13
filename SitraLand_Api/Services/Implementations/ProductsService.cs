using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Configurations;
using SitraLand_Api.Data;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductGallery;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Services.Interfaces;
using System.Net;

namespace SitraLand_Api.Services.Implementations
{
    public class ProductsService : IProductsService
    {
        private const int MaxGalleryImagesPerRequest = 20;
        private static readonly string[] ValidImageTypes = { ".jpg", ".png", ".jpeg", ".webp" };

        private readonly IImageService _imageService;
        private readonly DatabaseContext _databaseContext;

        public ProductsService(IImageService imageService, DatabaseContext databaseContext)
        {
            _imageService = imageService;
            _databaseContext = databaseContext;
        }

        public async Task<ResponseGlobal> GetProduct(int productId)
        {
            var result = new ResponseGlobal();

            var product = await _databaseContext.Products.AsNoTracking()
                .Where(x => x.ProductId == productId)
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
                }).ToListAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = product;
            return result;
        }

        public async Task<ResponseGlobal> GetProducts(int page = 1, int pageSize = 10, string? search = null, string? sortField = null, string? sortOrder = null)
        {
            var result = new ResponseGlobal();

            page = page < 1 ? 1 : page;
            pageSize = pageSize is < 1 or > 200 ? 10 : pageSize;

            var query = _databaseContext.Products.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.ProductName.Contains(term) || p.ProductDescription.Contains(term));
            }

            query = (sortField?.ToLowerInvariant(), sortOrder?.ToLowerInvariant()) switch
            {
                ("productname", "desc") => query.OrderByDescending(p => p.ProductName),
                ("productname", _) => query.OrderBy(p => p.ProductName),
                ("count", "desc") => query.OrderByDescending(p => p.Count),
                ("count", _) => query.OrderBy(p => p.Count),
                ("price", "desc") => query.OrderByDescending(p => p.Price),
                ("price", _) => query.OrderBy(p => p.Price),
                ("isactive", "desc") => query.OrderByDescending(p => p.IsActive),
                ("isactive", _) => query.OrderBy(p => p.IsActive),
                _ => query.OrderByDescending(p => p.ProductId)
            };

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                }).ToListAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.TotalCount = totalCount;
            result.Data = products;
            return result;
        }

        public async Task<ResponseGlobal> SaveProduct(SaveProductsDTO model)
        {
            var result = new ResponseGlobal();

            if (model == null)
            {
                result.Message = "Invalid Body Request";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            string imageFilePath = string.Empty;

            if (!string.IsNullOrEmpty(model.Image))
            {
                imageFilePath = SaveProductImage(model.Image, model.ImageName);
            }

            if (model.EditOrNewId == -1)
            {
                model.ImageFolderPath = imageFilePath;
                var product = model.ToProduct();
                await _databaseContext.Products.AddAsync(product);
                await _databaseContext.SaveChangesAsync();

                result.Message = "Success";
                result.Data = 1;
                result.Code = 200;
                return result;
            }

            if (!string.IsNullOrEmpty(imageFilePath))
            {
                var product = await _databaseContext.Products.FirstOrDefaultAsync(q => q.ProductId == model.EditOrNewId);
                if (product == null)
                {
                    result.Message = "Submitted Data Is Invalid";
                    return result;
                }

                model.ImageFolderPath = imageFilePath;
                model.MapTo(product);
                await _databaseContext.SaveChangesAsync();

                result.Message = "Updated With Photo Change";
                result.Data = 1;
                return result;
            }

            var affected = await _databaseContext.Products
                .Where(p => p.ProductId == model.EditOrNewId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.ProductName, model.ProductName)
                    .SetProperty(x => x.ProductDescription, model.ProductDescription)
                    .SetProperty(x => x.CategoryId, model.CategoryId)
                    .SetProperty(x => x.Count, model.Count)
                    .SetProperty(x => x.ExtraDetails, model.ExtraDetails)
                    .SetProperty(x => x.IsActive, model.IsActive)
                    .SetProperty(x => x.Price, model.Price));

            if (affected == 0)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            result.Message = "Updated with out photo change";
            result.Data = 1;
            return result;
        }

        public async Task<ResponseGlobal> DeleteProduct(int productId)
        {
            var result = new ResponseGlobal();

            if (productId < 1)
            {
                result.Message = "Invalid Body Request";
                return result;
            }

            var productExists = await _databaseContext.Products.AnyAsync(q => q.ProductId == productId);
            if (!productExists)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            await using var transaction = await _databaseContext.Database.BeginTransactionAsync();

            await _databaseContext.ProductGallerys
                .Where(g => g.ProductId == productId)
                .ExecuteDeleteAsync();

            await _databaseContext.Products
                .Where(q => q.ProductId == productId)
                .ExecuteDeleteAsync();

            await transaction.CommitAsync();

            result.Message = "Success";
            result.Data = 1;
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> GetCategories()
        {
            var result = new ResponseGlobal();

            var categories = await _databaseContext.Categories.AsNoTracking().ToListAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = categories;
            return result;
        }

        public async Task<ResponseGlobal> GetCategory(int categoryId, int page = 1, int pageSize = 16, string? search = null)
        {
            var result = new ResponseGlobal();

            page = page < 1 ? 1 : page;
            pageSize = pageSize is < 1 or > 100 ? 16 : pageSize;

            var query = _databaseContext.Products.AsNoTracking();
            if (categoryId != -1)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p => p.ProductName.Contains(term) || p.ProductDescription.Contains(term));
            }

            var totalCount = await query.CountAsync();

            // Only the fields the list needs, the description of the editor is heavy
            // and is loaded on the product page alone.
            var products = await query
                .OrderByDescending(p => p.Count)
                .ThenByDescending(p => p.ProductId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Count,
                    p.ProductDescription,
                    p.ProductId,
                    p.ImageFolderPath,
                    p.IsActive,
                    p.ProductName,
                    p.Price,
                    p.CategoryId
                })
                .ToListAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.TotalCount = totalCount;
            result.Data = products;
            return result;
        }

        public async Task<ResponseGlobal> SaveCategory(SaveCategoryDTO model)
        {
            var result = new ResponseGlobal();

            if (model.EditOrNewId == -1)
            {
                var category = model.ToCategory();
                await _databaseContext.Categories.AddAsync(category);
                await _databaseContext.SaveChangesAsync();

                result.Message = "Success";
                result.Data = 1;
                result.Code = 200;
                return result;
            }

            var existing = await _databaseContext.Categories.FirstOrDefaultAsync(q => q.CategoryId == model.EditOrNewId);
            if (existing == null)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            model.MapTo(existing);
            await _databaseContext.SaveChangesAsync();

            result.Message = "Updated";
            result.Data = 1;
            return result;
        }

        public async Task<ResponseGlobal> DeleteCategory(int categoryId)
        {
            var result = new ResponseGlobal();

            if (categoryId < 1)
            {
                result.Message = "Invalid Body Request";
                return result;
            }

            var categoryExists = await _databaseContext.Categories.AnyAsync(q => q.CategoryId == categoryId);
            if (!categoryExists)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            var hasProducts = await _databaseContext.Products.AnyAsync(p => p.CategoryId == categoryId);
            if (hasProducts)
            {
                result.Message = "This category still has products and cannot be deleted";
                result.Code = (int)HttpStatusCode.Conflict;
                return result;
            }

            await _databaseContext.Categories.Where(c => c.CategoryId == categoryId).ExecuteDeleteAsync();

            result.Message = "Success";
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> SaveProductGallery(SaveProductGalleryDTO model)
        {
            var result = new ResponseGlobal();

            if (model == null || model.ProductId < 1)
            {
                result.Message = "Invalid Body Request";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            if (model.ImageList == null || model.ImageList.Count == 0)
            {
                result.Message = "No image was submitted";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            if (model.ImageList.Count > MaxGalleryImagesPerRequest)
            {
                result.Message = $"At most {MaxGalleryImagesPerRequest} images can be uploaded at once";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            var productExists = await _databaseContext.Products.AnyAsync(p => p.ProductId == model.ProductId);
            if (!productExists)
            {
                result.Message = "Submitted Data Is Invalid";
                return result;
            }

            var imagePaths = new List<string>();
            foreach (var image in model.ImageList)
            {
                if (string.IsNullOrWhiteSpace(image.Image) || string.IsNullOrWhiteSpace(image.ImageName))
                {
                    result.Message = "Invalid product file";
                    result.Code = (int)HttpStatusCode.BadRequest;
                    return result;
                }

                imagePaths.Add(SaveProductImage(image.Image, image.ImageName));
            }

            var gallery = await _databaseContext.ProductGallerys
                .FirstOrDefaultAsync(g => g.ProductId == model.ProductId);

            if (gallery == null)
            {
                gallery = new ProductGallery
                {
                    ProductId = model.ProductId,
                    ImageFolderPath = imagePaths
                };
                await _databaseContext.ProductGallerys.AddAsync(gallery);
            }
            else
            {
                gallery.ImageFolderPath ??= new List<string>();
                gallery.ImageFolderPath.AddRange(imagePaths);
            }

            await _databaseContext.SaveChangesAsync();

            result.Message = "Success";
            result.Data = 1;
            result.Code = 200;
            return result;
        }

        public async Task<ResponseGlobal> GetProductGallery(int productId)
        {
            var result = new ResponseGlobal();

            if (productId < 1)
            {
                result.Message = "Invalid Body Request";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            var images = await _databaseContext.ProductGallerys.AsNoTracking()
                .Where(g => g.ProductId == productId)
                .Select(g => g.ImageFolderPath)
                .FirstOrDefaultAsync();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = images ?? new List<string>();
            return result;
        }

        private string SaveProductImage(string base64Content, string? fileName)
        {
            var type = Path.GetExtension(fileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(type) || Array.IndexOf(ValidImageTypes, type) == -1)
            {
                throw new InvalidOperationException("Invalid product file");
            }

            return _imageService.SaveBase64(base64Content, "Products", type, 2);
        }
    }
}
