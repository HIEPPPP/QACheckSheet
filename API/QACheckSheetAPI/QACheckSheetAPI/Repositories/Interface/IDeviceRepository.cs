using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IDeviceRepository
    {
        Task<bool> IsDeviceCodeExistAsync (string deviceCode);
        Task<List<DeviceMST>> GetListAsync();
        Task<DeviceMST?> GetAsync(int deviceId);
        Task<DeviceMST?> GetByCodeAsync(string deviceCode);
        Task<DeviceMST> CreateAsync(DeviceMST device);
        Task<DeviceMST?> UpdateAsync(DeviceMST device);
        Task DeleteAsync(DeviceMST device);
    }
}
