namespace SitraLand_Api.Data
{
    public class ProductGallery
    {
        public int ProductGalleryId { get; set; }
        public int ProductId { get; set; }
        public List<string>? ImageFolderPath { get; set; }
    }
}
