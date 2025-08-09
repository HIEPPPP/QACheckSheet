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

        public Task<List<SheetItemMST>> GetListAsync()
        {
            return context.SheetItems.Include(x => x.SheetMST).AsNoTracking().ToListAsync();    
        }       

        public async Task<SheetItemMST?> UpdateAsync(SheetItemMST item)
        {
            context.Update(item);
            await context.SaveChangesAsync();
            return item;
        }
    }
}
