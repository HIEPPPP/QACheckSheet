using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class SheetItemRepository : ISheetItemRepository
    {
        private readonly QACheckSheetDBContext context;

        public SheetItemRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }
        public async Task<SheetItemMST> CreateAsync(SheetItemMST item)
        {
            await context.SheetItems.AddAsync(item);
            await context.SaveChangesAsync();
            return item;
        }

        public async Task DeleteAsync(SheetItemMST item)
        {
            context.SheetItems.Remove(item);
            await context.SaveChangesAsync();
        }

        public Task<SheetItemMST?> GetAsync(int itemId)
        {
            return context.SheetItems.Include(x => x.SheetMST).FirstOrDefaultAsync(x => x.ItemId == itemId);
        }

        public Task<List<SheetItemMST>> GetBySheetAsync(int sheetId)
        {
            return context.SheetItems
                          .Where(x => x.SheetId == sheetId && x.IsActive)
                          .OrderBy(x => x.PathIds)    // nếu PathIds null lúc đầu, sử dụng OrderNumber fallback
                          .AsNoTracking()
                          .ToListAsync();
        }

        public Task<List<SheetItemMST>> GetDescendantsAsync(int sheetId, string pathPrefix)
        {
            // pathPrefix should end with '/': e.g. "/1/4/"
            return context.SheetItems
                          .Where(x => x.SheetId == sheetId && x.PathIds != null && x.PathIds.StartsWith(pathPrefix))
                          .ToListAsync();
        }

        public Task<List<SheetItemMST>> GetListAsync()
        {
            return context.SheetItems.Include(x => x.SheetMST).AsNoTracking().ToListAsync();    
        }

        public Task<SheetItemMST?> GetWithChildrenAsync(int itemId)
        {
            return context.SheetItems
                           .Include(x => x.Children)
                           .FirstOrDefaultAsync(x => x.ItemId == itemId);
        }

        public async Task<SheetItemMST?> UpdateAsync(SheetItemMST item)
        {
            context.Update(item);
            await context.SaveChangesAsync();
            return item;
        }

        public async Task UpdateRangeAsync(IEnumerable<SheetItemMST> items)
        {
            context.SheetItems.UpdateRange(items);
            await context.SaveChangesAsync();
        }
    }
}
