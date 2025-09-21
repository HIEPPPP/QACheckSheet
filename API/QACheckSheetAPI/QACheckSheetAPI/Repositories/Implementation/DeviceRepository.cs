using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly QACheckSheetDBContext context;

        public DeviceRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<DeviceMST> CreateAsync(DeviceMST device)
        {
            await context.Devices.AddAsync(device);
            await context.SaveChangesAsync();
            return device;
        }

        public async Task DeleteAsync(DeviceMST device)
        {
            context.Remove(device);
            await context.SaveChangesAsync();
        }

        public async Task<DeviceMST?> GetAsync(int deviceId)
        {
            return await context.Devices.Include(x => x.DeviceTypeMST).FirstOrDefaultAsync(x => x.DeviceId == deviceId);
        }

        public async Task<DeviceMST?> GetByCodeAsync(string deviceCode)
        {
            return await context.Devices.Include(x => x.DeviceTypeMST).FirstOrDefaultAsync(x => x.DeviceCode == deviceCode);
        }

        public async Task<List<DeviceMST>> GetListAsync()
        {
            return await context.Devices.Include(x => x.DeviceTypeMST).ToListAsync();
        }

        public async Task<List<DeviceSheetDTO>> GetListDeviceBySheetCodeAsync(string sheetCode)
        {
            var result = from s in context.Sheets
                         join sd in context.SheetDeviceTypes on s.SheetId equals sd.SheetId
                         join dt in context.DeviceTypes on sd.DeviceTypeId equals dt.TypeId
                         join d in context.Devices on dt.TypeId equals d.TypeId
                         where s.SheetCode == sheetCode
                         select new DeviceSheetDTO
                         {
                             SheetCode = s.SheetCode,
                             SheetName = s.SheetName,
                             DeviceCode = d.DeviceCode,
                             DeviceName = d.DeviceName
                         };

            var list = await result.ToListAsync();
            return list;
        }

        public async Task<List<DeviceMST>> GetListDeviceDashboard()
        {
            var todayIsMonday = DateTime.Now.DayOfWeek == DayOfWeek.Monday;

            return await context.Devices
                .Include(d => d.DeviceTypeMST)
                .Where(d =>
                    d.Status == "Đang sử dụng" &&
                    (
                        // effective frequency = FrequencyOverride ?? DeviceTypeMST.DefaultFrequency
                        ((d.FrequencyOverride ?? d.DeviceTypeMST.DefaultFrequency) == 1) // hàng ngày
                        ||
                        (
                            (d.FrequencyOverride ?? d.DeviceTypeMST.DefaultFrequency) == 7
                            && todayIsMonday // chỉ lấy khi hôm nay là Monday
                        )
                    )
                )
                .OrderBy(x => x.DeviceName)
                .ToListAsync();
        }

        public async Task<bool> IsDeviceCodeExistAsync(string deviceCode)
        {
            return await context.Devices.AnyAsync(x => x.DeviceCode == deviceCode);
        }

        public async Task<DeviceMST?> UpdateAsync(DeviceMST device)
        {
            try
            {
                context.Devices.Update(device);
                await context.SaveChangesAsync();
                return device;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }
        
    }
}
