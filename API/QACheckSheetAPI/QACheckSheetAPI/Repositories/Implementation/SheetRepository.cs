using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class SheetRepository : ISheetRepository
    {
        private readonly QACheckSheetDBContext context;

        public SheetRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<SheetMST> CreateAsync(SheetMST sheet)
        {
            await context.Sheets.AddAsync(sheet);
            await context.SaveChangesAsync();
            return sheet;
        }

        public async Task DeleteAsync(SheetMST sheet)
        {
            context.Sheets.Remove(sheet);
            await context.SaveChangesAsync();
        }

        public async Task<SheetMST?> GetAsync(int sheetId)
        {
            return await context.Sheets.FirstOrDefaultAsync(x => x.SheetID == sheetId);
        }

        public async Task<List<SheetMST>> GetListAsync()
        {
            return await context.Sheets.AsNoTracking().ToListAsync();
        }

        public async Task<bool> IsSheetCodeExistAsync(string sheetCode)
        {
            return await context.Sheets.AnyAsync(x => x.SheetCode == sheetCode);
        }

        public async Task<SheetMST?> UpdateAsync(SheetMST sheet)
        {
            context.Sheets.Update(sheet);
            await context.SaveChangesAsync();
            return sheet;
        }
    }
}
