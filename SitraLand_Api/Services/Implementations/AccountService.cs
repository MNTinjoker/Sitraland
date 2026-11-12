using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Models.UserModels;
using SitraLand_Api.Services.Interfaces;
using System.Net;

namespace SitraLand_Api.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApiUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private ApiUser _user;
        private readonly DatabaseContext _databaseContext;

        public AccountService(UserManager<ApiUser> userManager, IMapper mapper, IAuthService authService, DatabaseContext databaseContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _authService = authService;
            _databaseContext = databaseContext;
        }

        public async Task<ResponseGlobal> SignUp(UserDTO model)
        {
            var response = new ResponseGlobal();

            if (model == null || string.IsNullOrWhiteSpace(model.Mobile) || string.IsNullOrWhiteSpace(model.Password))
            {
                response.Message = "Model User Is Not Valid";
                response.Code = (int)HttpStatusCode.BadRequest;
                return response;
            }

            var mobile = model.Mobile.Trim();

            if (await _userManager.FindByNameAsync(mobile) != null ||
                await _userManager.Users.AnyAsync(u => u.PhoneNumber == mobile))
            {
                response.Message = "This mobile number is already registered";
                response.Code = (int)HttpStatusCode.Conflict;
                return response;
            }

            var user = _mapper.Map<ApiUser>(model);
            // The mobile number is the login identifier; the full name is only a display value.
            user.UserName = mobile;
            user.PhoneNumber = mobile;

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                response.Message = "Could not create user";
                response.Data = result.Errors;
                return response;
            }

            _user = await _userManager.FindByNameAsync(user.UserName);
            await _userManager.AddToRoleAsync(_user, "User");

            response.Message = "User Created Successfully";
            response.Code = (int)HttpStatusCode.OK;
            return response;
        }

        public async Task<ResponseGlobal> Login(LoginUserDTO model)
        {
            var result = new ResponseGlobal();

            _user = await _authService.ValidateUser(model);
            if (_user == null)
            {
                result.Message = "Dont Have Access";
                result.Code = (int)HttpStatusCode.Unauthorized;
                return result;
            }

            var roles = await _userManager.GetRolesAsync(_user);
            var role = roles.FirstOrDefault() ?? "User";

            result.Data = await _authService.CreateToken();
            result.Message = role;
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> AddRoleToUser(AddRoleToUserModel model)
        {
            var result = new ResponseGlobal();

            _user = await FindUserByLoginAsync(model.UserName);
            if (_user == null)
            {
                result.Message = "User Not Exists Or Mobile Wrong";
                result.Code = (int)HttpStatusCode.NotFound;
                return result;
            }

            var roles = await _userManager.GetRolesAsync(_user);
            if (roles.Count > 0)
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(_user, roles);
                if (!removeResult.Succeeded)
                {
                    result.Message = "Could not update user roles";
                    return result;
                }
            }

            var addResult = await _userManager.AddToRoleAsync(_user, model.Role);
            if (!addResult.Succeeded)
            {
                result.Message = "Could not update user roles";
                return result;
            }

            result.Message = "Success";
            result.Code = (int)HttpStatusCode.OK;
            return result;
        }

        public async Task<ResponseGlobal> GetRoleBasedUsers(string role)
        {
            var result = new ResponseGlobal();

            var users = await _userManager.GetUsersInRoleAsync(role);
            var userWithRole = users.Select(u => new
            {
                u.UserName,
                u.PhoneNumber
            }).ToList();

            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = userWithRole;
            return result;
        }

        public async Task<ResponseGlobal> GetRoles()
        {
            var result = new ResponseGlobal();

            var roles = await _databaseContext.Roles.AsNoTracking().ToListAsync();
            result.Message = "success";
            result.Code = (int)HttpStatusCode.OK;
            result.Data = roles;
            return result;
        }

        private async Task<ApiUser?> FindUserByLoginAsync(string userNameOrMobile)
        {
            var login = userNameOrMobile?.Trim();
            if (string.IsNullOrEmpty(login))
            {
                return null;
            }

            return await _userManager.FindByNameAsync(login) ??
                   await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == login);
        }
    }
}
