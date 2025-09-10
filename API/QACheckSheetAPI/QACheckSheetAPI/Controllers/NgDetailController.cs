using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.NgDetail;
using QACheckSheetAPI.Models.DTO.NgDetailDTO;
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

        // POST: api/NgDetail
        [HttpPost]
        public async Task<IActionResult> CreateNgDetail(CreateNgDetaiRequestDTO dto)
        {
            try
            {
                var created = await ngDetailServices.CreateNgDetail(dto);
                return Ok(new ApiResponse<NgDetailDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
            
        }

        // PUT: api/NgDetail/{id}
        [HttpPut("{ngId}")]
        public async Task<IActionResult> UpdateNgDetail(int ngId, UpdateNgDetailRequestDTO dto)
        {
            try
            {
                var updated = await ngDetailServices.UpdateNgDetail(ngId, dto);
                return Ok(new ApiResponse<NgDetailDTO>(200, "Cập nhật thành công", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(200, ex.Message));
            }
        }
    }
}
