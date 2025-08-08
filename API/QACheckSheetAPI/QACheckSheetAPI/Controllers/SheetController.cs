using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Services;
using QACheckSheetAPI.Models.DTO.Sheet;
using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SheetController : ControllerBase
    {
        private readonly SheetServices sheetService;

        public SheetController(SheetServices sheetService)
        {
            this.sheetService = sheetService;
        }

        // GET: api/sheet
        [HttpGet]
        public async Task<IActionResult> GetListSheet()
        {
            var list = await sheetService.GetListSheet();
            return Ok(new ApiResponse<List<SheetDTO>>(200, "OK", list));
        }

        // GET: api/sheet/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSheet(int id)
        {
            var device = await sheetService.GetSheetById(id);
            if (device == null)
            {
                return NotFound("Sheet không tồn tại");
            }
            return Ok(new ApiResponse<SheetDTO>(200, "OK", device));
        }

        // POST: api/deivce
        [HttpPost]
        public async Task<IActionResult> CreateSheet(CreateSheetRequestDTO dto)
        {
            try
            {
                var created = await sheetService.CreateSheet(dto);
                return Ok(new ApiResponse<SheetDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/sheet/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSheet(int id, UpdateSheetRequestDTO dto)
        {
            try
            {
                var updated = await sheetService.UpdateSheet(id, dto);
                return Ok(new ApiResponse<SheetDTO>(200, "OK", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }

        // DELETE: api/sheet/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await sheetService.DeleteSheet(id);
                return Ok(new ApiResponse<object>(200, "OK"));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
