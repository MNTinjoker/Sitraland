using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductGallery;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Models.Response;

namespace SitraLand_Api.Services.Interfaces
{
    public interface IProductsService
    {
        Task<ResponseGlobal> GetProducts(int page = 1, int pageSize = 10, string? search = null, string? sortField = null, string? sortOrder = null);
        Task<ResponseGlobal> GetProduct(int productId);
        Task<ResponseGlobal> SaveProduct(SaveProductsDTO model);
        Task<ResponseGlobal> DeleteProduct(int productId);
        Task<ResponseGlobal> GetCategories();
        Task<ResponseGlobal> GetCategory(int categoryId, int page = 1, int pageSize = 16, string? search = null);
        Task<ResponseGlobal> SaveCategory(SaveCategoryDTO model);
        Task<ResponseGlobal> DeleteCategory(int categoryId);
        Task<ResponseGlobal> SaveProductGallery(SaveProductGalleryDTO model);
        Task<ResponseGlobal> GetProductGallery(int productId);
    }
}
