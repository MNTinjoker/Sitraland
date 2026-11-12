using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductGallery;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private const long MaxUploadRequestBytes = 25 * 1024 * 1024;

        private readonly IProductsService _productsService;

        public ProductsController(IProductsService productsService)
        {
            _productsService = productsService;
        }

        [HttpGet("getProducts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProducts(int page = 1, int pageSize = 10, string? search = null, string? sortField = null, string? sortOrder = null)
        {
            var result = await _productsService.GetProducts(page, pageSize, search, sortField, sortOrder);

            return Ok(result);
        }

        [HttpGet("getProduct/{productId}")]
        public async Task<IActionResult> GetProduct(int productId)
        {
            var result = await _productsService.GetProduct(productId);

            return Ok(result);
        }

        [HttpPost("saveProduct")]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(MaxUploadRequestBytes)]
        public async Task<IActionResult> SaveProduct(SaveProductsDTO model)
        {
            var result = await _productsService.SaveProduct(model);

            return Ok(result);
        }

        [HttpDelete("deleteProduct/{productId}")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SaveCategory(SaveCategoryDTO model)
        {
            var result = await _productsService.SaveCategory(model);

            return Ok(result);
        }

        [HttpDelete("deleteCategory/{categoryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var result = await _productsService.DeleteCategory(categoryId);

            return Ok(result);
        }

        [HttpPost("saveProductGallery")]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(MaxUploadRequestBytes)]
        public async Task<IActionResult> SaveProductGallery(SaveProductGalleryDTO model)
        {
            var result = await _productsService.SaveProductGallery(model);

            return Ok(result);
        }

        [HttpGet("getProductGallery/{productId}")]
        public async Task<IActionResult> GetProductGallery(int productId)
        {
            var result = await _productsService.GetProductGallery(productId);

            return Ok(result);
        }
    }
}
