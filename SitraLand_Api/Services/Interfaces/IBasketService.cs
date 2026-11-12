using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.Response;

namespace SitraLand_Api.Services.Interfaces
{
    public interface IBasketService
    {
        Task<ResponseGlobal> SaveBasket(SaveBasketDTO model);
        Task<ResponseGlobal> GetAllBasket(int page = 1, int pageSize = 10, int? status = null, string? search = null);
        Task<ResponseGlobal> GetBasket(string basketCode);
        Task<List<object>> GetBasketProducts(int[] products);
        Task<ResponseGlobal> UpdateBasket(int basketId, UpdateBasketDTO model);
        Task<ResponseGlobal> DeleteBasket(int basketId);
        Task<ResponseGlobal> SendOrderConfirm(string basketCode);
    }
}
