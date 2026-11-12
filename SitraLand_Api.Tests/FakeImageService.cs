using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Tests;

internal sealed class FakeImageService : IImageService
{
    public string SaveBase64(string bs64, string TargetFolder, string FileType, int type)
    {
        return TargetFolder + "/fake" + FileType;
    }

    public string SaveBase64WithOutType(string bs64, string TargetFolder, int type)
    {
        return TargetFolder + "/fake";
    }
}
