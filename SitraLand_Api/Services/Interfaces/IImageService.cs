namespace SitraLand_Api.Services.Interfaces
{
    public interface IImageService
    {
        string SaveBase64(string bs64, string TargetFolder, string fileType, int type);
        string SaveBase64WithOutType(string bs64, string TargetFolder, int type);
    }
}
