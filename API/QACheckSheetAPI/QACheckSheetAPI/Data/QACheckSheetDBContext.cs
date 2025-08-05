using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Data
{
    public class QACheckSheetDBContext : DbContext
    {
        public QACheckSheetDBContext(DbContextOptions<QACheckSheetDBContext> options) : base(options)
        {
        }

        public virtual DbSet<DeviceTypeMST> DeviceTypes { get; set; }
        public virtual DbSet<DeviceMST> Devices { get; set; }
        public virtual DbSet<SheetMST> Sheets { get; set; }
        public virtual DbSet<SheetItemMST> SheetItems { get; set; }
        public virtual DbSet<SheetDeviceTypeMST> SheetDeviceTypes { get; set; }
        public virtual DbSet<CheckResult> CheckResults { get; set; }
        public virtual DbSet<NGDetail> NGDetails { get; set; }
        public virtual DbSet<ConfirmApprove> ConfirmApproves { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
    }
}
