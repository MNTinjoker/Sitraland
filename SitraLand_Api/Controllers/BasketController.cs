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
        private readonly ISmsService _smsService;

        public BasketController(IBasketService basketService, ISmsService smsService)
        {
            _basketService = basketService;
            _smsService = smsService;
        }

        [HttpPost("saveBasket")]
        public async Task<IActionResult> SaveBasket(SaveBasketDTO model)
        {
            var result = await _basketService.SaveBasket(model);

            return Ok(result);
        }

        [HttpGet("getAllBasket")]
        public async Task<IActionResult> GetAllBasket()
        {
            var result = await _basketService.GetAllBasket();

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
        public async Task<IActionResult> UpdateBasket(int basketId, UpdateBasketDTO model)
        {
            var result = await _basketService.UpdateBasket(basketId, model);

            return Ok(result);
        }

        [HttpGet("deleteBasket/{basketId}")]
        public async Task<IActionResult> DeleteProduct(int basketId)
        {
            var result = await _basketService.DeleteBasket(basketId);

            return Ok(result);
        }

        [HttpGet("sendOrderConfirm/{basketCode}")]
        public async Task<IActionResult> SendOrderConfirm(string basketCode)
        {
            var result = await _basketService.SendOrderConfirm(basketCode);

            return Ok(result);
        }

        [HttpGet("sendSmsTest")]
        public async Task<IActionResult> SendSmsTest()
        {
            var result = await _smsService.SendSms();

            return Ok(result);
        }
    }
}
