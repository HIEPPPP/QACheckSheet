using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models.DTO.User;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserServices userServices;

        public UserController(UserServices userServices)
        {
            this.userServices = userServices;
        }

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDTO dto)
        {
            try
            {
                var created = await userServices.CreateUserAsync(dto);
                return Ok(new ApiResponse<UserDTO>(200, "Tạo user thành công", created));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await userServices.GetAllAsync();
            return Ok(new ApiResponse<List<UserDTO>>(200, "OK", list));
        }

        // GET: api/user/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await userServices.GetByIdAsync(id);
            if (user == null)
                return NotFound(new ApiResponse<object>(404, "User không tồn tại"));
            return Ok(new ApiResponse<UserDTO>(200, "OK", user));
        }

        // PUT: api/user/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequestDTO dto)
        {
            try
            {
                var updated = await userServices.UpdateAsync(id, dto);
                return Ok(new ApiResponse<UserDTO>(200, "Cập nhật thành công", updated));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await userServices.DeleteAsync(id);
                return Ok(new ApiResponse<object>(200, "Xóa user thành công"));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
