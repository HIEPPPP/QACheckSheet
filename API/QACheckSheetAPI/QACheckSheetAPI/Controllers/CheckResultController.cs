using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
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

        // GET: api/CheckResult/getListResultNG
        [HttpGet("getListResultNG")]
        public async Task<IActionResult> GetListResultNG()
        {
            var list = await checkResultServices.GetListResultNG();
            return Ok(new ApiResponse<List<NGDetailDTO>>(200, "OK", list));
        }

        // GET: api/CheckResult/getListResultDayBySDCode
        [HttpGet("getListResultDayBySDCode")]
        public async Task<IActionResult> GetListResultDayBySDCode([FromQuery] string sheetCode, [FromQuery] string deviceCode)
        {
            var results = await checkResultServices.GetListResultDayBySDCode(sheetCode, deviceCode);
            return Ok(new ApiResponse<List<CheckResult>>(200, "OK", results));
        }

        // GET: api/CheckResult/getListResultDayBySDCodeAndDate
        [HttpGet("getListResultBySDCodeAndDate")]
        public async Task<IActionResult> GetListResultDayBySDCodeAndDate([FromQuery] string sheetCode, [FromQuery] string deviceCode, [FromQuery] DateTime dayRef)
        {
            var results = await checkResultServices.GetListResultDayBySDCodeAndDate(sheetCode, deviceCode, dayRef);
            return Ok(new ApiResponse<List<CheckResult>>(200, "OK", results));
        }

        // GET: api/CheckResult/getListResultDay
        [HttpGet("getListResultDay")]
        public async Task<IActionResult> GetListResultDay()
        {
            var results = await checkResultServices.GetListResultDay();
            return Ok(new ApiResponse<List<CheckResult>>(200, "OK", results));
        }

        // GET: api/CheckResult/getListResultApproveConfirmByMonth
        [HttpGet("getListResultApproveConfirmByMonth")]
        public async Task<IActionResult> GetListResultApproveConfirmByMonth(DateTime monthRef)
        {
            var results = await checkResultServices.GetListResultApproveConfirmByMonth(monthRef);
            return Ok(new ApiResponse<List<ApproveConfirmResultDTO>>(200, "OK", results));
        }

        // GET: api/CheckResult/getHeaderReport
        [HttpGet("getHeaderReport")]
        public async Task<IActionResult> GetHeaderReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            var header = await checkResultServices.GetHeaderReport(sheetCode, deviceCode, monthRef);
            return Ok(new ApiResponse<List<SheetDeviceTypeReportDTO>>(200, "OK", header));
        }

        // GET: api/CheckResult/getListResultReport
        [HttpGet("getResultReport")]
        public async Task<IActionResult> GetResultReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            var reports = await checkResultServices.GetResultReport(sheetCode, deviceCode, monthRef);
            return Ok(new ApiResponse<List<ResultReportDTO>>(200, "OK", reports));
        }

        // GET: api/CheckResult/getListResultReport
        [HttpGet("getNGReport")]
        public async Task<IActionResult> GetNGReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            var reports = await checkResultServices.GetNGReport(sheetCode, deviceCode, monthRef);
            return Ok(new ApiResponse<List<ResultNGDTO>>(200, "OK", reports));
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
