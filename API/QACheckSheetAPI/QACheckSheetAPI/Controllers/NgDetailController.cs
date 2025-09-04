using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NgDetailController : ControllerBase
    {
        private readonly NgDetailServices ngDetailServices;

        public NgDetailController(NgDetailServices ngDetailServices)
        {
            this.ngDetailServices = ngDetailServices;
        }

        // GET: api/NgDetail
        [HttpGet]
        public async Task<IActionResult> GetListNgDetail()
        {
            var list = await ngDetailServices.GetListNgDetail();
            return Ok(new ApiResponse<List<NGDetail>>(200, "OK", list));
        }
    }
}
