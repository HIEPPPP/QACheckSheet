using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class DeviceTypeRepository : IDeviceTypeRepository
    {
        private readonly QACheckSheetDBContext context;

        public DeviceTypeRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }
        public async Task<DeviceTypeMST> CreateAsync(DeviceTypeMST deviceType)
        {
            try
            {
                await context.AddAsync(deviceType);
                await context.SaveChangesAsync();
                return deviceType;
            }
            catch (Exception ex)
            {
                Console.WriteLine("SaveChanges Exception: " + ex.ToString());
                throw;
            }
        }

        public async Task DeleteAsync(DeviceTypeMST deviceType)
        {
            context.Remove(deviceType);
            await context.SaveChangesAsync();
        }

        public async Task<DeviceTypeMST?> GetAsync(int typeId)
        {
            return await context.DeviceTypes.FirstOrDefaultAsync(x => x.TypeID == typeId);
        }

        public async Task<List<DeviceTypeMST>> GetListAsync()
        {
            return await context.DeviceTypes.AsNoTracking().ToListAsync();
        }

        public async Task<bool> IsTypeCodeExistAsync(string typeCode)
        {
            return await context.DeviceTypes.AnyAsync(x => x.TypeCode == typeCode);
        }

        public async Task<DeviceTypeMST?> UpdateAsync(DeviceTypeMST deviceType)
        {
            context.DeviceTypes.Update(deviceType);
            await context.SaveChangesAsync();
            return deviceType;
        }
    }
}
