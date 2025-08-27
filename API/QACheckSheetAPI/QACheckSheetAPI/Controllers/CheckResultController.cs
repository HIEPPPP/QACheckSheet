using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.DTO.CheckResult;
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
    }
}
