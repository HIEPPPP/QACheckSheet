using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly DeviceServices deviceServices;

        public DeviceController(DeviceServices deviceServices)
        {
            this.deviceServices = deviceServices;
        }

        // GET: api/device
        [HttpGet]
        public async Task<IActionResult> GetListDevice()
        {
            var list = await deviceServices.GetListDevice();
            return Ok(new ApiResponse<List<DeviceDTO>>(200, "OK", list));
        }

        [HttpGet("getListDeviceDashboard")]
        public async Task<IActionResult> GetListDeviceDashboard()
        {
            var list = await deviceServices.GetListDeviceDashboard();
            return Ok(new ApiResponse<List<DeviceDTO>>(200, "OK", list));
        }

        // GET: api/device/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDevice(int id)
        {
            var device = await deviceServices.GetDeviceById(id);
            if (device == null)
            {
                return NotFound("Device không tồn tại");
            }
            return Ok(new ApiResponse<DeviceDTO>(200, "OK", device));
        }

        // GET: api/device/{deviceCode}
        [HttpGet("{deviceCode}")]
        public async Task<IActionResult> GetDeviceByCode(string deviceCode)
        {
            var device = await deviceServices.GetDeviceByCode(deviceCode);
            if (device == null)
            {
                return NotFound("Device không tồn tại");
            }
            return Ok(new ApiResponse<DeviceDTO>(200, "OK", device));
        }

        // GET: api/device/getDeviceBySheetCode
        [HttpGet("getDevicesBySheetCode")]
        public async Task<IActionResult> GetDevicesBySheetCode(string sheetCode)
        {
            var devices = await deviceServices.GetListDeviceBySheetCode(sheetCode);
            if (devices == null)
            {
                return NotFound("Device không tồn tại");
            }
            return Ok(new ApiResponse<List<DeviceSheetDTO>>(200, "OK", devices));
        }

        // POST: api/deivce
        [HttpPost]
        public async Task<IActionResult> CreateDevice(CreateDeviceRequestDTO dto)
        {
            try
            {
                var created = await deviceServices.CreateDevice(dto);
                return Ok(new ApiResponse<DeviceDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/device/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, UpdateDeviceRequestDTO dto)
        {
            try
            {
                var updated = await deviceServices.UpdateDevice(id, dto);
                return Ok(new ApiResponse<DeviceDTO>(200, "OK", updated));
            }
            catch(Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }

        // DELETE: api/device/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await deviceServices.DeleteDevice(id);
                return Ok(new ApiResponse<object>(200, "OK"));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
