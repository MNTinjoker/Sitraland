namespace SitraLand_Api.Models.ProductGallery
{
    public class SaveProductGalleryDTO
    {
        public int ProductId { get; set; }
        public List<ImageList>? ImageList { get; set; }
    }

    public class ImageList
    {
        public string? Image { get; set; }
        public string? ImageName { get; set; }
    }
}
