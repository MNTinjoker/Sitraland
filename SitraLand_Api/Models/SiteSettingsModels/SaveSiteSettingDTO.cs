namespace SitraLand_Api.Models.SiteSettingsModels
{
    public class SaveSiteSettingDTO
    {
        public string Key { get; set; } = string.Empty;
        public string? Value { get; set; }
        public string? Image { get; set; }
        public string? ImageName { get; set; }
    }
}
