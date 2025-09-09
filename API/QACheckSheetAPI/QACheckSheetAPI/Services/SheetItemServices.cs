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
        private readonly ISheetRepository sheetRepository;

        public SheetItemServices(ISheetItemRepository sheetItemRepository, IMapper mapper, QACheckSheetDBContext context, ISheetRepository sheetRepository)
        {
            this.sheetItemRepository = sheetItemRepository;
            this.mapper = mapper;
            this.context = context;
            this.sheetRepository = sheetRepository;
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

            var oldPathTitles = item.PathTitles ?? string.Empty;
            var titleChanged = false;

            if (!string.IsNullOrWhiteSpace(dto.Title) && dto.Title != item.Title)
            {
                item.Title = dto.Title;
                titleChanged = true;
            }

            // update các field khác
            item.DataType = dto.DataType;
            if (dto.Min.HasValue) item.Min = dto.Min.Value;
            if (dto.Max.HasValue) item.Max = dto.Max.Value;
            if (dto.IsRequired.HasValue) item.IsRequired = dto.IsRequired.Value;
            if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
            {
                item.UpdateBy = dto.UpdateBy;
                item.UpdateAt = DateTime.Now;
            }

            using (var tx = await context.Database.BeginTransactionAsync())
            {
                await sheetItemRepository.UpdateAsync(item);

                if (titleChanged)
                {
                    // rebuild current item's PathTitles from parent
                    if (item.ParentItemId == null)
                        item.PathTitles = item.Title;
                    else
                    {
                        var parent = await context.SheetItems.AsNoTracking()
                                        .FirstOrDefaultAsync(p => p.ItemId == item.ParentItemId);
                        if (parent == null) throw new Exception("Parent không tồn tại");
                        item.PathTitles = $"{parent.PathTitles} > {item.Title}";
                    }

                    context.SheetItems.Update(item);
                    await context.SaveChangesAsync();

                    // dùng PathIds để tìm descendants (bao gồm cả nhiều cấp)
                    var pathPrefix = item.PathIds; // e.g. "/1/3/15/"
                    var oldPrefixForTitles = string.IsNullOrEmpty(oldPathTitles) ? "" : oldPathTitles + " > ";
                    var newPrefixForTitles = item.PathTitles + " > ";

                    var descendants = await context.SheetItems
                        .Where(s => s.ItemId != item.ItemId && s.PathIds != null && s.PathIds.StartsWith(pathPrefix))
                        .ToListAsync();

                    foreach (var d in descendants)
                    {
                        if (!string.IsNullOrEmpty(oldPrefixForTitles) && d.PathTitles != null && d.PathTitles.StartsWith(oldPrefixForTitles))
                        {
                            d.PathTitles = newPrefixForTitles + d.PathTitles.Substring(oldPrefixForTitles.Length);
                        }
                        else
                        {
                            // defensive: fallback — rebuild by traversing parents (omitted for brevity)
                        }
                    }

                    if (descendants.Count > 0)
                    {
                        context.SheetItems.UpdateRange(descendants);
                        await context.SaveChangesAsync();
                    }
                }

                await tx.CommitAsync();
            }

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
            // Lấy tất cả sheets và items
            var sheets = await sheetRepository.GetListAsync();       
            var items = await sheetItemRepository.GetListAsync();

            // map items sang DTO
            var itemDtos = items.Select(i => mapper.Map<ItemTreeDTO>(i)).ToList();

            // Tạo groups từ bảng Sheet - đảm bảo luôn có 1 group cho mỗi sheet, kể cả khi chưa có item
            var groups = sheets
                .Select(s => new SheetGroupDTO
                {
                    SheetId = s.SheetId,
                    SheetName = s.SheetName,
                    SheetCode = s.SheetCode,
                    Items = new List<ItemTreeDTO>()
                })
                .ToDictionary(x => x.SheetId);

            // Nếu có item thuộc sheet lạ (không có trong sheets) thì thêm defensive group
            foreach (var dto in itemDtos)
            {
                if (!groups.ContainsKey(dto.SheetId))
                {
                    groups[dto.SheetId] = new SheetGroupDTO
                    {
                        SheetId = dto.SheetId,
                        SheetName = null,
                        SheetCode = null,
                        Items = new List<ItemTreeDTO>()
                    };
                }
            }

            // Tạo lookup để lấy items theo sheet nhanh
            var itemsLookup = itemDtos.ToLookup(i => i.SheetId);

            // Với mỗi sheet, build cây nếu có items
            foreach (var kv in groups)
            {
                var sheetId = kv.Key;
                var grpDto = kv.Value;

                var flatForSheet = itemsLookup[sheetId].ToList();
                if (flatForSheet.Count == 0)
                {
                    grpDto.Items = new List<ItemTreeDTO>(); // giữ rỗng
                    continue;
                }

                // build id -> node map, reset children
                var map = flatForSheet.ToDictionary(
                    i => i.ItemId,
                    i => { i.Children = new List<ItemTreeDTO>(); return i; }
                );

                var roots = new List<ItemTreeDTO>();
                foreach (var node in map.Values)
                {
                    if (node.ParentItemId == null || node.ParentItemId == 0)
                    {
                        roots.Add(node);
                    }
                    else if (map.TryGetValue(node.ParentItemId.Value, out var parent))
                    {
                        parent.Children.Add(node);
                    }
                    else
                    {
                        // parent missing -> biến thành root (phòng trường hợp dữ liệu bị rời rạc)
                        roots.Add(node);
                    }
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

            // trả về danh sách group, ordered by SheetName hoặc SheetId tùy bạn
            return groups.Values.OrderBy(g => g.SheetId).ToList();
        }

    }
}
