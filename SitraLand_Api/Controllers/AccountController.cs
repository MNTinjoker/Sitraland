using Microsoft.AspNetCore.Mvc;
using SitraLand_Api.Models.UserModels;
using SitraLand_Api.Services.Interfaces;

namespace SitraLand_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("signUp")]
        public async Task<IActionResult> SignUp(UserDTO model)
        {
            var result = await _accountService.SignUp(model);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDTO model)
        {
            var result = await _accountService.Login(model);

            return Ok(result);
        }

        [HttpPost("addRoleToUser")]
        public async Task<IActionResult> AddRoleToUser(AddRoleToUserModel model)
        {
            var result = await _accountService.AddRoleToUser(model);

            return Ok(result);
        }

        [HttpGet("GetRoleBasedUsers/{role}")]
        public async Task<IActionResult> GetRoleBasedUsers(string role)
        {
            var result = await _accountService.GetRoleBasedUsers(role);

            return Ok(result);
        }

        [HttpGet("getRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var result = await _accountService.GetRoles();

            return Ok(result);
        }
    }
}
