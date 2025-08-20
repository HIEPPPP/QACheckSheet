using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SheetDeviceTypeController : ControllerBase
    {
        private readonly SheetDeviceTypeServices sheetDeviceTypeServices;

        public SheetDeviceTypeController(SheetDeviceTypeServices sheetDeviceTypeServices)
        {
            this.sheetDeviceTypeServices = sheetDeviceTypeServices;
        }

        // GET: api/sheetDeviceType
        [HttpGet]
        public async Task<IActionResult> GetListSheet()
        {
            var list = await sheetDeviceTypeServices.GetListSheetDeviceType();
            return Ok(new ApiResponse<List<SheetDeviceTypeDTO>>(200, "OK", list));
        }

        // GET: api/sheetDeviceType/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSheetDeviceTypeByDeviceTypeId(int id)
        {
            var sheetDeviceType = await sheetDeviceTypeServices.GetSheetDeviceTypeById(id);
            if (sheetDeviceType == null)
            {
                return NotFound("Sheet không tồn tại");
            }
            return Ok(new ApiResponse<SheetDeviceTypeDTO>(200, "OK", sheetDeviceType));
        }

        // POST: api/sheetDeviceType
        [HttpPost]
        public async Task<IActionResult> CreateSheetDeviceType(CreateSheetDeviceTypeRequestDTO dto)
        {
            try
            {
                var created = await sheetDeviceTypeServices.CreateSheetDeviceType(dto);
                return Ok(new ApiResponse<SheetDeviceTypeDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/sheetDeviceType/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSheetDeviceType(int id, UpdateSheetDeviceTypeRequestDTO dto)
        {
            try
            {
                var updated = await sheetDeviceTypeServices.UpdateSheetDeviceType(id, dto);
                return Ok(new ApiResponse<SheetDeviceTypeDTO>(200, "OK", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }

        // DELETE: api/sheet/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSheetDeviceType([FromRoute] int id)
        {
            try
            {
                await sheetDeviceTypeServices.DeleteSheetDeviceType(id);
                return Ok(new ApiResponse<object>(200, "OK"));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
