using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface ISheetDeviceTypeRepository
    {
        Task<List<SheetDeviceTypeMST>> GetListAsync();
        Task<SheetDeviceTypeMST?> GetAsync(int id);
        Task<SheetDeviceTypeMST> CreateAsync(SheetDeviceTypeMST sheetDevice);
        Task<SheetDeviceTypeMST?> UpdateAsync(SheetDeviceTypeMST sheetDevice);
        Task DeleteAsync(SheetDeviceTypeMST sheetDevice);
        Task<bool> IsSheetDeviceTypeExistAsync(int deviceTypeId, int sheetId);        
    }
}
