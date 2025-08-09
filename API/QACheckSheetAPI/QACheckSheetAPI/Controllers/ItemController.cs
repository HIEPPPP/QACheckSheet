using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QACheckSheetAPI.Models;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Models.DTO.SheetItem;
using QACheckSheetAPI.Services;

namespace QACheckSheetAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly SheetItemServices itemServices;

        public ItemController(SheetItemServices itemServices)
        {
            this.itemServices = itemServices;
        }

        // GET: api/item
        [HttpGet]
        public async Task<IActionResult> GetListItem()
        {
            var list = await itemServices.GetListItem();
            return Ok(new ApiResponse<List<ItemDTO>>(200, "OK", list));
        }

        // GET: api/item/{id}
        public async Task<IActionResult> GetItem(int id)
        {
            var item = await itemServices.GetItemByID(id);
            if(item == null)
            {
                return NotFound("Item không tồn tại");
            }
            return Ok(new ApiResponse<ItemDTO>(200, "OK", item));
        }

        // POST: api/item
        [HttpPost]
        public async Task<IActionResult> CreateDevice(CreateItemRequestDTO dto)
        {
            try
            {
                var created = await itemServices.CreateItem(dto);
                return Ok(new ApiResponse<ItemDTO>(200, "OK", created));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<object>(400, ex.Message));
            }
        }

        // PUT: api/item/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, UpdateItemRequestDTO dto)
        {
            try
            {
                var updated = await itemServices.UpdateItem(id, dto);
                return Ok(new ApiResponse<ItemDTO>(200, "OK", updated));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }

        // DELETE: api/item/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await itemServices.DeleteItem(id);
                return Ok(new ApiResponse<object>(200, "OK"));
            }
            catch (Exception ex)
            {
                return NotFound(new ApiResponse<object>(404, ex.Message));
            }
        }
    }
}
