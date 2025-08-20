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

            if(!string.IsNullOrWhiteSpace(dto.Title))
                item.Title = dto.Title;            
            if (!string.IsNullOrEmpty(dto.DataType))
                item.DataType = dto.DataType;            
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

            if (item.ParentItemId.HasValue)
            {
                var parent = await context.SheetItems.FirstOrDefaultAsync(p => p.ItemId == item.ParentItemId.Value && p.SheetId == item.SheetId);
                if (parent == null) throw new Exception("Parent không tồn tại trong sheet");
                //if (parent.Level >= 4) throw new Exception("Không thể thêm: vượt quá depth tối đa 4");
            }

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

        public async Task DeleteItem(int id)
        {
            var item = await sheetItemRepository.GetWithChildrenAsync(id) ?? throw new Exception("Item không tồn tại");
            if (item.Children != null && item.Children.Any())
            {
                // policy: prevent delete if has children
                throw new Exception("Không thể xóa item còn chứa item con. Vui lòng xóa con trước.");
            }
            // or implement soft delete: item.IsActive = false; Update
            await sheetItemRepository.DeleteAsync(item);
        }

        public async Task<List<ItemTreeDTO>> GetTreeBySheetId(int sheetId)
        {
            var items = await sheetItemRepository.GetBySheetAsync(sheetId);
            var map = items.ToDictionary(i => i.ItemId, i => mapper.Map<ItemTreeDTO>(i));
            var roots = new List<ItemTreeDTO>();
            foreach (var it in map.Values)
            {
                if (it.ParentItemId == null) roots.Add(it);
                else if (map.TryGetValue(it.ParentItemId.Value, out var parent)) parent.Children.Add(it);
            }
            // sort children by OrderNumber
            void sortRec(ItemTreeDTO n) { n.Children = n.Children.OrderBy(c => c.OrderNumber).ToList(); n.Children.ForEach(sortRec); }
            roots.ForEach(sortRec);
            return roots;
        }

        public async Task<List<SheetGroupDTO>> GetTree()
        {
            // Lấy tất cả items
            var items = await sheetItemRepository.GetListAsync(); 
            var itemDtos = items.Select(i => mapper.Map<ItemTreeDTO>(i)).ToList();

            // Group by sheetId
            var groups = itemDtos.GroupBy(x => x.SheetId)
                                 .Select(g => new SheetGroupDTO
                                 {
                                     SheetId = g.Key,
                                     SheetName = g.First().PathTitles != null ? null : null // placeholder; we'll set below
                                                                                            // Items filled below
                                 })
                                 .ToDictionary(x => x.SheetId);

            // If your ItemDTO contains sheetName/sheetCode fields in mapping, use them
            // For safety, build dictionary of sheet metadata from original domain items:
            var sheetMeta = items.GroupBy(i => i.SheetId)
                                 .ToDictionary(g => g.Key, g => new {
                                     SheetName = g.First().SheetMST?.SheetName ?? g.First().PathTitles,
                                     SheetCode = g.First().SheetMST?.SheetCode
                                 });

            // For each group, build tree from its flat items
            foreach (var kv in groups)
            {
                var sheetId = kv.Key;
                var grpDto = kv.Value;

                // assign metadata
                if (sheetMeta.TryGetValue(sheetId, out var meta))
                {
                    grpDto.SheetName = meta.SheetName;
                    grpDto.SheetCode = meta.SheetCode;
                }

                // take flat items for this sheet
                var flatForSheet = itemDtos.Where(x => x.SheetId == sheetId).ToList();

                // build id -> node map
                var map = flatForSheet.ToDictionary(i => i.ItemId, i => { i.Children = new List<ItemTreeDTO>(); return i; });

                var roots = new List<ItemTreeDTO>();
                foreach (var node in map.Values)
                {
                    if (node.ParentItemId == null || node.ParentItemId == 0)
                        roots.Add(node);
                    else if (map.TryGetValue(node.ParentItemId.Value, out var parent))
                        parent.Children.Add(node);
                    else
                        roots.Add(node); // defensive: parent missing -> treat as root
                }

                // sort children recursively by OrderNumber
                void SortRec(ItemTreeDTO n)
                {
                    n.Children = n.Children.OrderBy(c => c.OrderNumber).ToList();
                    n.Children.ForEach(SortRec);
                }
                roots = roots.OrderBy(r => r.OrderNumber).ToList();
                roots.ForEach(SortRec);

                grpDto.Items = roots;
            }

            // return groups as list ordered by sheetId (or sheetName)
            return groups.Values.OrderBy(g => g.SheetId).ToList();
        }
    }
}
