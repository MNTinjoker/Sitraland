namespace SitraLand_Api.Data
{
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public int Price { get; set; }
        public int Count { get; set; }
        public bool IsActive { get; set; }
        public string? ExtraDetails { get; set; }
        public string? Image { get; set; }
        public string? ImageName { get; set; }
        public int? CategoryId { get; set; }
        public string? ImageFolderPath { get; set; }
    }
}
