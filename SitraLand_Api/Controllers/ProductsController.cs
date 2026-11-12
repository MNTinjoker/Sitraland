using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productsService;

        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }

        [HttpGet("getProducts")]
        public async Task<IActionResult> GetProducts()
        {
            var result = await _productsService.GetProducts();

            return Ok(result);
        }

        [HttpGet("getProduct/{productId}")]
        public async Task<IActionResult> GetProduct(int productId)
        {
            var result = await _productsService.GetProduct(productId);

            return Ok(result);
        }

        [HttpPost("saveProduct")]
        public async Task<IActionResult> SaveProduct(SaveProductsDTO model)
        {
            var result = await _productsService.SaveProduct(model);

            return Ok(result);
        }

        [HttpGet("deleteProduct/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            var result = await _productsService.DeleteProduct(productId);

            return Ok(result);
        }

        [HttpGet("getCategories")]
        public async Task<IActionResult> GetCategories()
        {
            var result = await _productsService.GetCategories();

            return Ok(result);
        }

        [HttpGet("getCategory/{categoryId}")]
        public async Task<IActionResult> GetCategory(int categoryId)
        {
            var result = await _productsService.GetCategory(categoryId);

            return Ok(result);
        }

        [HttpPost("saveCategory")]
        public async Task<IActionResult> SaveCategory(SaveCategoryDTO model)
        {
            var result = await _productsService.SaveCategory(model);

            return Ok(result);
        }

        [HttpGet("deleteCategory/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var result = await _productsService.DeleteCategory(categoryId);

            return Ok(result);
        }
    }
}
