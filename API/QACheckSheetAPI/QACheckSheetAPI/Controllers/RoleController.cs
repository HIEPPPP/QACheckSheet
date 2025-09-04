using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleServices roleServices;

        public RoleController(RoleServices roleServices)
        {
            this.roleServices = roleServices;
        }

        // GET: api/Role
        [HttpGet]
        public async Task<IActionResult> GetListRole()
        {
            var list = await roleServices.GetListRole();
            return Ok(new ApiResponse<List<Role>>(200, "OK", list));
        }
    }
}
