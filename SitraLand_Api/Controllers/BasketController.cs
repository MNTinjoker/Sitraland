using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.Response;
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

        // Returns the service result with its HTTP status while keeping the body
        // compatible with existing clients that read the ResponseGlobal envelope.
        private IActionResult FromResult(ResponseGlobal result)
        {
            if (result.Code >= 400 && result.Code <= 599)
            {
                return StatusCode(result.Code, result);
            }

            return Ok(result);
        }

        [HttpPost("saveBasket")]
        public async Task<IActionResult> SaveBasket(SaveBasketDTO model)
        {
            var result = await _basketService.SaveBasket(model);

            return FromResult(result);
        }

        [HttpGet("getAllBasket")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBasket(int page = 1, int pageSize = 10, int? status = null, string? search = null)
        {
            var result = await _basketService.GetAllBasket(page, pageSize, status, search);

            return FromResult(result);
        }

        [HttpGet("getBasket/{basketCode}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBasket(string basketCode)
        {
            var result = await _basketService.GetBasket(basketCode);

            return FromResult(result);
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

            return FromResult(result);
        }

        [HttpDelete("deleteBasket/{basketId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBasket(int basketId)
        {
            var result = await _basketService.DeleteBasket(basketId);

            return FromResult(result);
        }

        [HttpPost("sendOrderConfirm/{basketCode}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendOrderConfirm(string basketCode)
        {
            var result = await _basketService.SendOrderConfirm(basketCode);

            return FromResult(result);
        }
    }
}
