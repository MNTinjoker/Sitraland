using SitraLand_Api.Models.Response;

namespace SitraLand_Api.Services.Interfaces
{
    public interface ISmsService
    {
        Task<ResponseGlobal> SendSms();
    }
}
