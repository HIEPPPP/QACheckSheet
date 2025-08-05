using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Auth;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthServices authServices;

        public AuthController(AuthServices authServices)
        {
            this.authServices = authServices;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
        {
            var result = await authServices.LoginAsync(dto);
            if (result == null)
            {
                return Unauthorized(new ApiResponse<object>(401, "Sai mã nhân viên hoặc mật khẩu."));
            }

            return Ok(new ApiResponse<LoginResponseDTO>(200, "Đăng nhập thành công", result));
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO dto)
        {
            try
            {
                var success = await authServices.ChangePasswordAsync(dto);
                if (!success)
                    return BadRequest(new ApiResponse<object>(400, "Mật khẩu cũ không đúng."));

                return Ok(new ApiResponse<object>(200, "Đổi mật khẩu thành công."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
