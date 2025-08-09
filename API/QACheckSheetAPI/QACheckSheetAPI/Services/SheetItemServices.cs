using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.SheetItem;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class SheetItemServices
    {
        private readonly ISheetItemRepository sheetItemRepository;
        private readonly IMapper mapper;

        public SheetItemServices(ISheetItemRepository sheetItemRepository, IMapper mapper)
        {
            this.sheetItemRepository = sheetItemRepository;
            this.mapper = mapper;
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

        public async Task<ItemDTO> CreateItem(CreateItemRequestDTO dto) 
        {
            var itemDomain = mapper.Map<SheetItemMST>(dto); 
            var created = await sheetItemRepository.CreateAsync(itemDomain);
            return mapper.Map<ItemDTO>(created);
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

        public async Task DeleteItem(int id)
        {
            var item = await sheetItemRepository.GetAsync(id)
                ?? throw new Exception("Item không tồn tại");
            await sheetItemRepository.DeleteAsync(item);
        }
    }
}
