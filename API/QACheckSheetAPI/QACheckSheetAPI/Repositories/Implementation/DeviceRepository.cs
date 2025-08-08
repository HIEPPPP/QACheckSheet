using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
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
            return await context.Devices.Include(x => x.DeviceTypeMST).FirstOrDefaultAsync(x => x.DeviceID == deviceId);
        }

        public async Task<List<DeviceMST>> GetListAsync()
        {
            return await context.Devices.Include(x => x.DeviceTypeMST).ToListAsync();
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
