using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class SheetDeviceTypeRepository : ISheetDeviceTypeRepository
    {
        private readonly QACheckSheetDBContext context;

        public SheetDeviceTypeRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }
        public async Task<SheetDeviceTypeMST> CreateAsync(SheetDeviceTypeMST sheetDevice)
        {
            try
            {
                await context.AddAsync(sheetDevice);
                await context.SaveChangesAsync();
                return sheetDevice;
            }
            catch (Exception ex)
            {
                Console.WriteLine("SaveChanges Exception: " + ex.ToString());
                throw;
            }
        }

        public async Task DeleteAsync(SheetDeviceTypeMST sheetDevice)
        {
            context.Remove(sheetDevice);
            await context.SaveChangesAsync();
        }

        public async Task<SheetDeviceTypeMST?> GetAsync(int id)
        {
            return await context.SheetDeviceTypes.Include(x => x.DeviceTypeMST).Include(x => x.SheetMST).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<SheetDeviceTypeMST>> GetListAsync()
        {
            return await context.SheetDeviceTypes.Include(x => x.DeviceTypeMST).Include(x => x.SheetMST).AsNoTracking().ToListAsync();
        }

        public async Task<bool> IsSheetDeviceTypeExistAsync(int deviceTypeId, int sheetId)
        {
            return await context.SheetDeviceTypes.AnyAsync(x => x.DeviceTypeId == deviceTypeId && x.SheetId == sheetId);
        }

        public async Task<SheetDeviceTypeMST?> UpdateAsync(SheetDeviceTypeMST sheetDevice)
        {
            context.SheetDeviceTypes.Update(sheetDevice);
            await context.SaveChangesAsync();
            return sheetDevice;
        }
    }
}
