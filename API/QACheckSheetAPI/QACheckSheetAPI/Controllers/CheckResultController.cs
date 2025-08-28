using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckResultController : ControllerBase
    {
        private readonly CheckResultServices checkResultServices;

        public CheckResultController(CheckResultServices checkResultServices)
        {
            this.checkResultServices = checkResultServices;
        }

        // GET: api/CheckResult
        [HttpGet]
        public async Task<IActionResult> GetListResultNG()
        {
            var list = await checkResultServices.GetListResultNG();
            return Ok(new ApiResponse<List<CheckResultDTO>>(200, "OK", list));
        }

        // GET: api/CheckResult/getListResultDayBySDCode
        [HttpGet("getListResultDayBySDCode")]
        public async Task<IActionResult> GetListResultDayBySDCode([FromQuery] string sheetCode, [FromQuery] string deviceCode)
        {
            var results = await checkResultServices.GetListResultDayBySDCode(sheetCode, deviceCode);
            return Ok(new ApiResponse<List<CheckResult>>(200, "OK", results));
        }        

        // POST: api/CheckResult
        [HttpPost]
        public async Task<IActionResult> CreateResults(List<CreateCheckResultRequestDTO> dto)
        {
            try
            {
                var created = await checkResultServices.CreateCheckResult(dto);
                return Ok(new ApiResponse<List<CheckResultDTO>>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
            
        }

        // PUT: api/CheckResult/{resultId}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResult(int id, UpdateCheckResultRequestDTO dto)
        {
            try
            {
                var updated = await checkResultServices.UpdateCheckResult(id, dto);
                return Ok(new ApiResponse<CheckResultDTO>(200, "OK", updated));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
            
        }

        // PUT: api/CheckResult/bulk (Cập nhật nhiều dữ liệu cùng một lúc)
        [HttpPut("bulk")]
        public async Task<IActionResult> BulkUpdate([FromBody] List<UpdateCheckResultRequestDTO> dtoList)
        {
            if (dtoList == null || dtoList.Count == 0)
                return BadRequest(new ApiResponse<object>(400, "No items to update"));

            try
            {
                var updated = await checkResultServices.BulkUpdateCheckResults(dtoList);
                return Ok(new ApiResponse<List<CheckResultDTO>>(200, "OK", updated));
            }
            catch (KeyNotFoundException knf)
            {
                return NotFound(new ApiResponse<object>(404, knf.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/CheckResult/confirm
        [HttpPut("confirm")]
        public async Task<IActionResult> ResultConfirm([FromBody] List<ConfirmResultRequestDTO> dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var results = await checkResultServices.ConfirmResult(dto);
            return results != null ? Ok(new ApiResponse<List<CheckResult>>(200, "Confirmed", results))
                                   : NotFound(new ApiResponse<string>(404, "Result not found"));
        }
    }
}
