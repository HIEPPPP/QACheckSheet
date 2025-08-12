using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.SheetItem;
using QACheckSheetAPI.Repositories.Implementation;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class SheetItemServices
    {
        private readonly ISheetItemRepository sheetItemRepository;
        private readonly IMapper mapper;
        private readonly QACheckSheetDBContext context;

        public SheetItemServices(ISheetItemRepository sheetItemRepository, IMapper mapper, QACheckSheetDBContext context)
        {
            this.sheetItemRepository = sheetItemRepository;
            this.mapper = mapper;
            this.context = context;
        }

        public async Task<List<ItemDTO>> GetListItem()
        {
            var list = await sheetItemRepository.GetListAsync();    
            return mapper.Map<List<ItemDTO>>(list);
        }

        public async Task<ItemDTO?> GetItemByID(int id)
        {
            var item = await sheetItemRepository.GetAsync(id);
            return item == null ? null : mapper.Map<ItemDTO>(item);
        }        

        public async Task<ItemDTO> UpdateItem(int id, UpdateItemRequestDTO dto)
        {
            var item = await sheetItemRepository.GetAsync(id)
                ?? throw new Exception("Item không tồn tại");

            if(dto.SheetId.HasValue)
                item.SheetId = dto.SheetId.Value;
            if(!string.IsNullOrWhiteSpace(dto.Title))
                item.Title = dto.Title;            
            if (!string.IsNullOrEmpty(dto.DataType))
                item.DataType = dto.DataType;
            if(dto.OrderNumber.HasValue)
                item.OrderNumber = dto.OrderNumber.Value;
            if(dto.Min.HasValue)
                item.Min = dto.Min.Value;
            if(dto.Max.HasValue)
                item.Max = dto.Max.Value;
            if(dto.IsRequired.HasValue)
                item.IsRequired = dto.IsRequired.Value;
            if (!string.IsNullOrWhiteSpace(item.UpdateBy))
            {
                item.UpdateBy = dto.UpdateBy;
                item.UpdateAt = DateTime.Now;
            }
            await sheetItemRepository.UpdateAsync(item);
            return mapper.Map<ItemDTO>(item);
        }        

        public async Task<ItemDTO> CreateItem(CreateItemRequestDTO dto)
        {
            var item = mapper.Map<SheetItemMST>(dto);

            if (item.OrderNumber == 0)
            {
                var last = await context.SheetItems
                    .Where(s => s.SheetId == item.SheetId && s.ParentItemId == item.ParentItemId)
                    .OrderByDescending(s => s.OrderNumber)
                    .Select(s => s.OrderNumber)
                    .FirstOrDefaultAsync();
                item.OrderNumber = last + 1;
            }

            await sheetItemRepository.CreateAsync(item);

            await ComputeAndUpdatePathForNewItemAsync(item);

            return mapper.Map<ItemDTO>(item);
        }

        private async Task ComputeAndUpdatePathForNewItemAsync(SheetItemMST item)
        {
            if (item.ParentItemId == null)
            {
                item.Level = 1;
                item.PathIds = $"/{item.ItemId}/";
                item.PathTitles = item.Title;
            }
            else
            {
                var parent = await context.SheetItems.FirstOrDefaultAsync(p => p.ItemId == item.ParentItemId);
                if (parent == null) throw new Exception("Parent không tồn tại");
                item.Level = parent.Level + 1;
                item.PathIds = $"{parent.PathIds}{item.ItemId}/";
                item.PathTitles = $"{parent.PathTitles} > {item.Title}";
            }
            context.SheetItems.Update(item);
            await context.SaveChangesAsync();
        }        
    }
}
