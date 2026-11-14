using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.SiteSettingsModels;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private const long MaxUploadRequestBytes = 15 * 1024 * 1024;
        private readonly ISiteSettingsService _siteSettingsService;

        public SiteSettingsController(ISiteSettingsService siteSettingsService)
        {
            _siteSettingsService = siteSettingsService;
        }

        [HttpGet("getSettings")]
        public async Task<IActionResult> GetSettings()
        {
            var result = await _siteSettingsService.GetSettings();
            return Ok(result);
        }

        [HttpPost("saveSetting")]
        [Authorize(Roles = "Admin")]
        [RequestSizeLimit(MaxUploadRequestBytes)]
        public async Task<IActionResult> SaveSetting([FromBody] SaveSiteSettingDTO model)
        {
            var result = await _siteSettingsService.SaveSetting(model);
            if (result.Code >= 400 && result.Code <= 599)
            {
                return StatusCode(result.Code, result);
            }
            return Ok(result);
        }
    }
}
