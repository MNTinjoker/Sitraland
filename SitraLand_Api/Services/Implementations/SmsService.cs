using Kavenegar;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Services.Implementations
{
    public class SmsService : ISmsService
    {
        public async Task<ResponseGlobal> SendSms()
        {
            var result = new ResponseGlobal();
            try
            {
                var sender = "10008663";
                var receptor = "09939685240";
                var message = "سلام تست sms برای ما";
                var api = new KavenegarApi("6B623030433858324F46573045454B4B6962415A44336E497651466E536D5772634574506D57524E5A384D3D");
                var res = await api.Send(sender, receptor, message);

                result.Data = res;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}
