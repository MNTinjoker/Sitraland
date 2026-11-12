using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;

        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        [HttpPost("saveBasket")]
        public async Task<IActionResult> SaveBasket(SaveBasketDTO model)
        {
            var result = await _basketService.SaveBasket(model);

            return Ok(result);
        }

        [HttpGet("getAllBasket")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBasket(int page = 1, int pageSize = 10, int? status = null, string? search = null)
        {
            var result = await _basketService.GetAllBasket(page, pageSize, status, search);

            return Ok(result);
        }

        [HttpGet("getBasket/{basketCode}")]
        public async Task<IActionResult> GetBasket(string basketCode)
        {
            var result = await _basketService.GetBasket(basketCode);

            return Ok(result);
        }

        [HttpPost("getBasketProducts")]
        public async Task<IActionResult> GetBasketProducts(int[] products)
        {
            var result = await _basketService.GetBasketProducts(products);

            return Ok(result);
        }

        [HttpPost("updateBasket/{basketId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBasket(int basketId, UpdateBasketDTO model)
        {
            var result = await _basketService.UpdateBasket(basketId, model);

            return Ok(result);
        }

        [HttpDelete("deleteBasket/{basketId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBasket(int basketId)
        {
            var result = await _basketService.DeleteBasket(basketId);

            return Ok(result);
        }

        [HttpPost("sendOrderConfirm/{basketCode}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendOrderConfirm(string basketCode)
        {
            var result = await _basketService.SendOrderConfirm(basketCode);

            return Ok(result);
        }
    }
}
