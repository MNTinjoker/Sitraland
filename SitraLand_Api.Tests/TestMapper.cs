using AutoMapper;
using SitraLand_Api.Configurations;

namespace SitraLand_Api.Tests;

internal static class TestMapper
{
    public static IMapper Create()
    {
        var configuration = new MapperConfiguration(
            cfg => cfg.AddProfile<MapperInitilizer>(),
            Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);

        return configuration.CreateMapper();
    }
}
