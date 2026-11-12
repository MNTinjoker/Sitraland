using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Models.Response;

namespace SitraLand_Api.Services.Interfaces
{
    public interface IProductsService
    {
        Task<ResponseGlobal> GetProducts();
        Task<ResponseGlobal> GetProduct(int productId);
        Task<ResponseGlobal> SaveProduct(SaveProductsDTO model);
        Task<ResponseGlobal> DeleteProduct(int productId);
        Task<ResponseGlobal> GetCategories();
        Task<ResponseGlobal> GetCategory(int categoryId);
        Task<ResponseGlobal> SaveCategory(SaveCategoryDTO model);
        Task<ResponseGlobal> DeleteCategory(int categoryId);
    }
}
