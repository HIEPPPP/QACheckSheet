using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface ISheetRepository
    {
        Task<bool> IsSheetCodeExistAsync(string sheetCode);
        Task<List<SheetMST>> GetListAsync();
        Task<SheetMST?> GetAsync(int sheetId);
        Task<SheetMST?> GetByCodeAsync(string sheetCode);
        Task<SheetMST> CreateAsync(SheetMST sheet);
        Task<SheetMST?> UpdateAsync(SheetMST sheet);
        Task DeleteAsync(SheetMST sheet);
    }
}
