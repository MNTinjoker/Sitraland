using SitraLand_Api.Data;
using SitraLand_Api.Models.UserModels;

namespace SitraLand_Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiUser?> ValidateUser(LoginUserDTO userDto);
        Task<string> CreateToken();
    }
}
