using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Models.SiteSettingsModels;
using SitraLand_Api.Services.Interfaces;
using System.Net;

namespace SitraLand_Api.Services.Implementations
{
    public class SiteSettingsService : ISiteSettingsService
    {
        private static readonly string[] ValidImageTypes = { ".jpg", ".png", ".jpeg", ".webp", ".svg", ".ico" };
        private readonly DatabaseContext _databaseContext;
        private readonly IImageService _imageService;

        public SiteSettingsService(DatabaseContext databaseContext, IImageService imageService)
        {
            _databaseContext = databaseContext;
            _imageService = imageService;
        }

        public async Task<ResponseGlobal> GetSettings()
        {
            var result = new ResponseGlobal();
            var settings = await _databaseContext.SiteSettings.AsNoTracking()
                .ToDictionaryAsync(s => s.Key, s => s.Value);

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = settings;
            return result;
        }

        public async Task<ResponseGlobal> SaveSetting(SaveSiteSettingDTO model)
        {
            var result = new ResponseGlobal();

            if (model == null || string.IsNullOrWhiteSpace(model.Key))
            {
                result.Message = "Invalid Body Request";
                result.Code = (int)HttpStatusCode.BadRequest;
                return result;
            }

            var key = model.Key.Trim();
            string? value = model.Value;

            if (!string.IsNullOrEmpty(model.Image))
            {
                var type = Path.GetExtension(model.ImageName)?.ToLowerInvariant();
                if (string.IsNullOrEmpty(type) || Array.IndexOf(ValidImageTypes, type) == -1)
                {
                    result.Message = "Invalid file type";
                    result.Code = (int)HttpStatusCode.BadRequest;
                    return result;
                }

                value = _imageService.SaveBase64(model.Image, "Site", type, 2);
            }

            var setting = await _databaseContext.SiteSettings.FirstOrDefaultAsync(s => s.Key == key);
            if (setting == null)
            {
                setting = new SiteSetting { Key = key, Value = value };
                await _databaseContext.SiteSettings.AddAsync(setting);
            }
            else
            {
                setting.Value = value;
            }

            await _databaseContext.SaveChangesAsync();

            result.Message = "Success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = new { key, value };
            return result;
        }
    }
}
