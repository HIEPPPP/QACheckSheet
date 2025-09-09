using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Services;
using QACheckSheetAPI.Models.DTO.ConfirmApprove;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfirmApproveController : ControllerBase
    {
        private readonly ConfirmApproveServices confirmApproveServices;

        public ConfirmApproveController(ConfirmApproveServices confirmApproveServices)
        {
            this.confirmApproveServices = confirmApproveServices;
        }

        // GET: api/ConfirmApprove/
        [HttpPost]
        public async Task<IActionResult> CreateConfirm(CreateConfirmRequestDTO dto)
        {
            try
            {
                var created = await confirmApproveServices.CreateConfirm(dto);
                return Ok(new ApiResponse<ConfirmApproveDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/ConfirmApprove/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApprove(int id, [FromBody] UpdateApproveRequestDTO dto)
        {
            try
            {
                var updated = await confirmApproveServices.UpdateApprove(id, dto);
                return Ok(new ApiResponse<ConfirmApproveDTO>(200, "Cập nhật thành công", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(200, ex.Message));
            }
        }
    }
}
