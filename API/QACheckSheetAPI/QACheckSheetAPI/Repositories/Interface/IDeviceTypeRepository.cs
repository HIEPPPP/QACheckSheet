using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IDeviceTypeRepository
    {
        Task<bool> IsTypeCodeExistAsync(string typeCode);
        Task<List<DeviceTypeMST>> GetListAsync();
        Task<DeviceTypeMST?> GetAsync(int typeId);
        Task<DeviceTypeMST> CreateAsync(DeviceTypeMST deviceType);
        Task<DeviceTypeMST?> UpdateAsync(DeviceTypeMST deviceType);
        Task DeleteAsync(DeviceTypeMST deviceType);
    }
}
