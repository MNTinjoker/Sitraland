using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Services.Implementations
{
    public class ImageService : IImageService, IDisposable
    {
        public void Dispose() { }

        public string SaveBase64(string bs64, string TargetFolder, string FileType, int type)
        {
            string imageLocation = string.Empty;
            string base64 = bs64.Split(',').Length > 1 ? bs64.Split(',')[1] : bs64;
            var edbytess = Convert.FromBase64String(base64);
            var name = Guid.NewGuid().ToString();
            imageLocation = TargetFolder + "/" + name + FileType;
            if (type == 1)
            {
                using (var imageFile =
                    new FileStream(imageLocation,
                        FileMode.Create))
                {
                    imageFile.Write(edbytess, 0, edbytess.Length);
                    imageFile.Flush();
                }
            }
            else
            {
                using (var imageFile =
                    new FileStream(Path.Combine("Files/" + imageLocation),
                        FileMode.Create))
                {
                    imageFile.Write(edbytess, 0, edbytess.Length);
                    imageFile.Flush();
                }
            }
            return imageLocation;
        }

        public string SaveBase64WithOutType(string bs64, string TargetFolder, int type)
        {
            string imageLocation = string.Empty;
            string base64 = bs64.Split(',').Length > 1 ? bs64.Split(',')[1] : bs64;
            var edbytess = Convert.FromBase64String(base64);
            var name = Guid.NewGuid().ToString();
            imageLocation = TargetFolder + "/" + name;
            if (type == 1)
            {
                using (var imageFile =
                    new FileStream(imageLocation,
                        FileMode.Create))
                {
                    imageFile.Write(edbytess, 0, edbytess.Length);
                    imageFile.Flush();
                }
            }
            else
            {
                using (var imageFile =
                    new FileStream(Path.Combine("Files/" + imageLocation),
                        FileMode.Create))
                {
                    imageFile.Write(edbytess, 0, edbytess.Length);
                    imageFile.Flush();
                }
            }
            return imageLocation;
        }

    }
}
