using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Services.Interfaces;
using System.Net;

namespace SitraLand_Api.Services.Implementations
{
    public class ProductsService : IProductsService
    {
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;
        private readonly DatabaseContext _databaseContext;

        public ProductsService(IMapper mapper, IImageService imageService, DatabaseContext databaseContext)
        {
            _mapper = mapper;
            _imageService = imageService;
            _databaseContext = databaseContext;
        }

        public async Task<ResponseGlobal> GetProduct(int productId)
        {
            var result = new ResponseGlobal();

            try
            {
                var product = _databaseContext.Products.AsNoTracking()
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
                    });

                result.Message = "success";
                result.Code = (int)HttpStatusCode.OK;
                result.Data = product;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> GetProducts()
        {
            var result = new ResponseGlobal();

            try
            {
                var test = await _databaseContext.Products.AsNoTracking().Select(p => new
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
                result.Data = test;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> SaveProduct(SaveProductsDTO model)
        {
            var result = new ResponseGlobal();

            try
            {
                if (model.EditOrNewId == -1)
                {
                    string[] validTypes = { ".jpg", ".png", ".jpeg", ".webp" };
                    string type = Path.GetExtension(model.ImageName);

                    string imageFilePath = string.Empty;
                    int count = 0;

                    foreach (char c in model.ImageName)
                    {
                        if ("." == c.ToString())
                        {
                            count++;
                        }
                    }

                    if (count > 1)
                    {
                        throw new Exception("Invalid File");
                    }

                    if (!string.IsNullOrEmpty(model.Image))
                    {
                        int pos = Array.IndexOf(validTypes, type);
                        if (pos > -1)
                        {
                            imageFilePath = _imageService.SaveBase64(model.Image, "Products", type, 2);
                        }
                        else
                        {
                            throw new Exception("Invalid product file");
                        }
                    }

                    model.ImageFolderPath = imageFilePath;
                    var product = _mapper.Map<Product>(model);
                    await _databaseContext.Products.AddAsync(product);
                    await _databaseContext.SaveChangesAsync();

                    result.Message = "Success";
                    result.Data = 1;
                    result.Code = 200;
                }
                else
                {
                    string[] validTypes = { ".jpg", ".png", ".jpeg", ".webp" };
                    string type = Path.GetExtension(model.ImageName);

                    string imageFilePath = string.Empty;
                    int count = 0;

                    foreach (char c in model.ImageName)
                    {
                        if ("." == c.ToString())
                        {
                            count++;
                        }
                    }

                    if (count > 1)
                    {
                        throw new Exception("Invalid File");
                    }

                    if (!string.IsNullOrEmpty(model.Image))
                    {
                        int pos = Array.IndexOf(validTypes, type);
                        if (pos > -1)
                        {
                            imageFilePath = _imageService.SaveBase64(model.Image, "Products", type, 2);
                        }
                        else
                        {
                            throw new Exception("Invalid product file");
                        }
                        model.ImageFolderPath = imageFilePath;

                        var product1 = await _databaseContext.Products.FirstOrDefaultAsync(q => q.ProductId == model.EditOrNewId);
                        if (product1 == null)
                        {
                            result.Message = "Submitted Data Is Invalid";
                            return result;
                        }

                        _mapper.Map(model, product1);
                        _databaseContext.Products.Attach(product1);
                        _databaseContext.Products.Entry(product1).State = EntityState.Modified;
                        await _databaseContext.SaveChangesAsync();

                        result.Message = "Updated With Photo Change";
                        result.Data = 1;
                    }
                    else
                    {
                        await _databaseContext.Products.Where(p => p.ProductId == model.EditOrNewId)
                            .ExecuteUpdateAsync(setters => setters
                            .SetProperty(x => x.ProductName, model.ProductName)
                            .SetProperty(x => x.ProductDescription, model.ProductDescription)
                            .SetProperty(x => x.CategoryId, model.CategoryId)
                            .SetProperty(x => x.Count, model.Count)
                            .SetProperty(x => x.ExtraDetails, model.ExtraDetails)
                            .SetProperty(x => x.IsActive, model.IsActive)
                            .SetProperty(x => x.Price, model.Price));
                        await _databaseContext.SaveChangesAsync();

                        result.Message = "Updated with out photo change";
                        result.Data = 1;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> DeleteProduct(int productId)
        {
            var result = new ResponseGlobal();

            try
            {
                if (productId < 1)
                {
                    result.Message = "Invalid Body Request";
                    return result;
                }
                var product = await _databaseContext.Products.AsNoTracking().FirstOrDefaultAsync(q => q.ProductId == productId);
                if (product == null)
                {
                    result.Message = "Submitted Data Is Invalid";
                    return result;
                }

                await _databaseContext.Products.Where(q => q.ProductId == productId)
                    .ExecuteDeleteAsync();
                await _databaseContext.SaveChangesAsync();

                result.Message = "Success";
                result.Data = 1;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> GetCategories()
        {
            var result = new ResponseGlobal();

            try
            {
                var categories = await _databaseContext.Categories.AsNoTracking().ToListAsync();

                result.Message = "success";
                result.Code = (int)HttpStatusCode.OK;
                result.Data = categories;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> GetCategory(int categoryId)
        {
            var result = new ResponseGlobal();

            try
            {
                if (categoryId == -1)
                {
                    var test = await _databaseContext.Products.AsNoTracking().Select(p => new
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
                    result.Data = test;
                }
                else
                {
                    var category = _databaseContext.Products.AsNoTracking()
                 .Where(p => p.CategoryId == categoryId)
                 .Select(c => new
                 {
                     c.Count,
                     c.ProductDescription,
                     c.ExtraDetails,
                     c.ProductId,
                     c.ImageFolderPath,
                     c.IsActive,
                     c.ProductName,
                     c.Price,
                     c.CategoryId
                 });

                    result.Message = "success";
                    result.Code = (int)HttpStatusCode.OK;
                    result.Data = category;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> SaveCategory(SaveCategoryDTO model)
        {
            var result = new ResponseGlobal();

            try
            {
                if (model.EditOrNewId == -1)
                {
                    var category = _mapper.Map<Category>(model);
                    await _databaseContext.Categories.AddAsync(category);
                    await _databaseContext.SaveChangesAsync();

                    result.Message = "Success";
                    result.Data = 1;
                    result.Code = 200;
                }
                else
                {
                    var category = await _databaseContext.Categories.FirstOrDefaultAsync(q => q.CategoryId == model.EditOrNewId);
                    if (category == null)
                    {
                        result.Message = "Submitted Data Is Invalid";
                        return result;
                    }

                    _mapper.Map(model, category);
                    _databaseContext.Categories.Attach(category);
                    _databaseContext.Categories.Entry(category).State = EntityState.Modified;
                    await _databaseContext.SaveChangesAsync();

                    result.Message = "Updated";
                    result.Data = 1;
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> DeleteCategory(int categoryId)
        {
            var result = new ResponseGlobal();

            try
            {
                if (categoryId < 1)
                {
                    result.Message = "Invalid Body Request";
                    return result;
                }
                var category = await _databaseContext.Categories.AsNoTracking().FirstOrDefaultAsync(q => q.CategoryId == categoryId);

                if (category == null)
                {
                    result.Message = "Submitted Data Is Invalid";
                    return result;
                }

                var categoryDeleted = await _databaseContext.Categories.Where(b => b.CategoryId == categoryId)
                   .ExecuteDeleteAsync();
                await _databaseContext.SaveChangesAsync();

                result.Message = "Success";
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
