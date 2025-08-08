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
    }
}
