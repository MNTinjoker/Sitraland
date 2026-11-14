namespace SitraLand_Api.Data
{
    public class SiteSetting
    {
        public int SiteSettingId { get; set; }
        public string Key { get; set; } = string.Empty;
        public string? Value { get; set; }
    }
}
