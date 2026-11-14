using SitraLand_Api.Models.Response;
using SitraLand_Api.Models.SiteSettingsModels;

namespace SitraLand_Api.Services.Interfaces
{
    public interface ISiteSettingsService
    {
        Task<ResponseGlobal> GetSettings();
        Task<ResponseGlobal> SaveSetting(SaveSiteSettingDTO model);
    }
}
