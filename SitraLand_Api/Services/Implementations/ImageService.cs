using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Services.Implementations
{
    public class ImageService : IImageService, IDisposable
    {
        public void Dispose() { }

        public string SaveBase64(string bs64, string TargetFolder, string FileType, int type)
        {
            return Save(bs64, TargetFolder, FileType, type);
        }

        public string SaveBase64WithOutType(string bs64, string TargetFolder, int type)
        {
            return Save(bs64, TargetFolder, null, type);
        }

        private static string Save(string bs64, string targetFolder, string? fileType, int type)
        {
            var base64 = bs64.Split(',').Length > 1 ? bs64.Split(',')[1] : bs64;
            var contents = Convert.FromBase64String(base64);
            var name = Guid.NewGuid().ToString();
            var relativeLocation = targetFolder + "/" + name + fileType;

            var fullLocation = type == 1
                ? relativeLocation
                : Path.Combine("Files", targetFolder, name + fileType);

            var directory = Path.GetDirectoryName(fullLocation);
            if (!string.IsNullOrEmpty(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.WriteAllBytes(fullLocation, contents);

            return relativeLocation;
        }
    }
}
