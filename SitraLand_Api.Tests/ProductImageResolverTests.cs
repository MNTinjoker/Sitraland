using SitraLand_Api.Services.Implementations;

namespace SitraLand_Api.Tests;

public class ProductImageResolverTests
{
    private static Func<string, bool> Only(params string[] existing)
    {
        return path => existing.Contains(path);
    }

    [Fact]
    public void Resolve_UsesTheMainImageWhenItsFileExists()
    {
        var result = ProductImageResolver.Resolve("Products/main.png", new List<string> { "Products/gallery.png" }, Only("Products/main.png", "Products/gallery.png"));

        Assert.Equal("Products/main.png", result);
    }

    [Fact]
    public void Resolve_FallsBackToTheGalleryWhenTheMainFileIsMissing()
    {
        var result = ProductImageResolver.Resolve("shop/gear.png", new List<string> { "Products/gallery.png" }, Only("Products/gallery.png"));

        Assert.Equal("Products/gallery.png", result);
    }

    [Fact]
    public void Resolve_SkipsGalleryPhotosWhoseFileIsMissing()
    {
        var result = ProductImageResolver.Resolve("shop/gear.png", new List<string> { "Products/missing.png", "Products/found.png" }, Only("Products/found.png"));

        Assert.Equal("Products/found.png", result);
    }

    [Fact]
    public void Resolve_ReturnsTheMainImageWhenNoPhotoExists()
    {
        var result = ProductImageResolver.Resolve("shop/gear.png", new List<string> { "Products/missing.png" }, Only());

        Assert.Equal("shop/gear.png", result);
    }

    [Fact]
    public void Resolve_UsesTheGalleryWhenTheMainImageIsEmpty()
    {
        var result = ProductImageResolver.Resolve(null, new List<string> { "Products/gallery.png" }, Only("Products/gallery.png"));

        Assert.Equal("Products/gallery.png", result);
    }
}
