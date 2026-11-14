using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SitraLand_Api.Data;
using SitraLand_Api.Models.UserModels;
using SitraLand_Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SitraLand_Api.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApiUser> _userManager;
        private readonly IConfiguration _configuration;
        private ApiUser _user;

        public AuthService(UserManager<ApiUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> CreateToken()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        private SecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var expiration = DateTime.Now.AddDays(Convert.ToDouble(jwtSettings.GetSection("lifetime").Value));

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiration,
                signingCredentials: signingCredentials);

            return token;
        }

        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
            {
             new Claim(ClaimTypes.Name, _user.UserName)
            };
            var roles = await _userManager.GetRolesAsync(_user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = jwtSettings.GetSection("Key").Value;
            var secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        public async Task<ApiUser?> ValidateUser(LoginUserDTO model)
        {
            var input = model.UserName?.Trim() ?? string.Empty;

            var candidates = new List<string> { input };
            if (input.StartsWith("09") && input.Length == 11)
            {
                candidates.Add(input.Substring(1));      // 9xxxxxxxxx
                candidates.Add("98" + input.Substring(1)); // 989xxxxxxxxx
            }
            else if (input.StartsWith("9") && input.Length == 10)
            {
                candidates.Add("0" + input);             // 09xxxxxxxxx
                candidates.Add("98" + input);            // 989xxxxxxxxx
            }
            else if (input.StartsWith("989") && input.Length == 12)
            {
                candidates.Add("0" + input.Substring(2)); // 09xxxxxxxxx
                candidates.Add(input.Substring(2));       // 9xxxxxxxxx
            }

            foreach (var candidate in candidates.Distinct())
            {
                _user = await _userManager.FindByNameAsync(candidate);
                if (_user != null) break;
            }

            // Users created before the sign-up fix were stored with their full name as the
            // user name, so fall back to the phone number for those accounts.
            if (_user == null)
            {
                foreach (var candidate in candidates.Distinct())
                {
                    _user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == candidate);
                    if (_user != null) break;
                }
            }

            return _user != null && await _userManager.CheckPasswordAsync(_user, model.Password)
                ? _user
                : null;
        }
    }
}
