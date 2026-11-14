namespace SitraLand_Api.Models.CategoryModels
{
    public class SaveCategoryDTO
    {
        public int EditOrNewId { get; set; }
        public string CategoryTitle { get; set; }
        public string? Image { get; set; }
        public string? ImageName { get; set; }
        public string? ImagePath { get; set; }
    }
}
