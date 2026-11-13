namespace SitraLand_Api.Services.Implementations
{
    /// <summary>
    /// Chooses the photo that represents a product.
    ///
    /// A product shows its main photo. Some legacy products still point to a
    /// main photo whose file is missing on the server, while the real photo was
    /// uploaded to the gallery. In that case the first gallery photo that
    /// exists is used, so an uploaded photo is still shown.
    /// </summary>
    internal static class ProductImageResolver
    {
        /// <summary>
        /// Returns the main photo when its file exists, otherwise the first
        /// gallery photo that exists. When no photo exists the main photo is
        /// returned unchanged, so the client can show its own placeholder.
        /// </summary>
        public static string? Resolve(string? mainImage, IReadOnlyList<string>? gallery, Func<string, bool>? fileExists = null)
        {
            var exists = fileExists ?? FileExists;

            if (!string.IsNullOrWhiteSpace(mainImage) && exists(mainImage))
            {
                return mainImage;
            }

            var galleryImage = gallery?.FirstOrDefault(path => !string.IsNullOrWhiteSpace(path) && exists(path));

            return galleryImage ?? mainImage;
        }

        private static bool FileExists(string relativePath)
        {
            return System.IO.File.Exists(Path.Combine("Files", relativePath));
        }
    }
}
