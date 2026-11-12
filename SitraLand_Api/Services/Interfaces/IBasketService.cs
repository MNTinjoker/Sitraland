using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.Response;

namespace SitraLand_Api.Services.Interfaces
{
    public interface IBasketService
    {
        Task<ResponseGlobal> SaveBasket(SaveBasketDTO model);
        Task<ResponseGlobal> GetAllBasket();
        Task<ResponseGlobal> GetBasket(string basketCode);
        Task<List<object>> GetBasketProducts(int[] products);
        Task<ResponseGlobal> UpdateBasket(int basketId, UpdateBasketDTO model);
        Task<ResponseGlobal> DeleteBasket(int basketId);
        Task<ResponseGlobal> SendOrderConfirm(string basketCode);
    }
}
