using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface ISheetItemRepository
    {
        Task<List<SheetItemMST>> GetListAsync();
        Task<SheetItemMST?> GetAsync(int itemId);
        Task<SheetItemMST> CreateAsync(SheetItemMST item);
        Task<SheetItemMST?> UpdateAsync(SheetItemMST item);
        Task DeleteAsync(SheetItemMST item);
        Task<List<SheetItemMST>> GetBySheetAsync(int sheetId);
        Task<List<SheetItemMST>> GetDescendantsAsync(int sheetId, string pathPrefix); // PathIds startswith
        Task UpdateRangeAsync(IEnumerable<SheetItemMST> items);
        Task<SheetItemMST?> GetWithChildrenAsync(int itemId); // optional
    }
}
