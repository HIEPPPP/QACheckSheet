using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly DeviceTypeServices deviceTypeServices;

        public DeviceTypeController(DeviceTypeServices deviceTypeServices) {
            this.deviceTypeServices = deviceTypeServices;
        }

        // GET: api/DeviceType
        [HttpGet]
        public async Task<IActionResult> GetListDeviceType()
        {
            var list = await deviceTypeServices.GetListDeviceType();
            return Ok(new ApiResponse<List<DeviceTypeMST>>(200, "OK", list));
        }

        // GET: api/DeviceType/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDeviceTypeById(int id)
        {
            var type = await deviceTypeServices.GetDeviceTypeById(id);
            if (type == null)
            {
                return NotFound(new ApiResponse<object>(404, "DeviceType không tồn tại"));
            }
            return Ok(new ApiResponse<DeviceTypeDTO>(200, "Tạo devicetype thành công", type));
        }

        // POST: api/DeviceType/createDeviceType
        [HttpPost("createDeviceType")]
        public async Task<IActionResult> CreateDeviceType(CreateDeviceTypeRequestDTO dto)
        {
            try
            {
                var created = await deviceTypeServices.CreateDeviceType(dto);
                return Ok(new ApiResponse<DeviceTypeDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/DeviceType/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDeviceType(int id, [FromBody] UpdateDeviceTypeRequestDTO dto)
        {
            try
            {
                var updated = await deviceTypeServices.UpdateDeviceType(id, dto);
                return Ok(new ApiResponse<DeviceTypeDTO>(200, "Cập nhật thành công", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(200, ex.Message));
            }
        }

        // DELETE: api/DeviceType/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeviceType(int id)
        {
            try
            {
                await deviceTypeServices.DeleteDeviceType(id);
                return Ok(new ApiResponse<object>(200, "Xóa DeviceType thành công!"));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }   

    }
}
