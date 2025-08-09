using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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

        //public void Configure(EntityTypeBuilder<SheetItemMST> builder)
        //{
        //    builder.ToTable("SheetItemMST");

        //    builder.HasKey(x => x.ItemId);

        //    builder.Property(x => x.Title).IsRequired().HasMaxLength(700);
        //    builder.Property(x => x.PathIds).HasMaxLength(500);
        //    builder.Property(x => x.PathTitles).HasMaxLength(2000);

        //    builder.Property(x => x.Min).HasPrecision(18, 4);
        //    builder.Property(x => x.Max).HasPrecision(18, 4);

        //    builder.Property(x => x.IsActive).HasDefaultValue(true);

        //    builder.HasOne(x => x.Parent)
        //           .WithMany(p => p.Children)
        //           .HasForeignKey(x => x.ParentItemId)
        //           .OnDelete(DeleteBehavior.Restrict);

        //    builder.HasOne(x => x.SheetMST)
        //           .WithMany(s => s.SheetItemMSTs)
        //           .HasForeignKey(x => x.SheetId)
        //           .OnDelete(DeleteBehavior.Cascade);

        //    builder.HasIndex(x => x.PathIds);
        //    builder.HasIndex(x => new { x.SheetId, x.ParentItemId, x.OrderNumber });
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // composite key
            modelBuilder.Entity<SheetDeviceTypeMST>()
                .HasKey(sdt => new { sdt.SheetId, sdt.DeviceTypeId });

            // optional: configure relationships explicitly
            modelBuilder.Entity<SheetDeviceTypeMST>()
                .HasOne(sdt => sdt.SheetMST)
                .WithMany(s => s.SheetDeviceTypeMSTs)   // ensure SheetMST has ICollection<SheetDeviceTypeMST> SheetDeviceTypes
                .HasForeignKey(sdt => sdt.SheetId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SheetDeviceTypeMST>()
                .HasOne(sdt => sdt.DeviceTypeMST)
                .WithMany(d => d.SheetDeviceTypeMSTs)   // ensure DeviceTypeMST has ICollection<SheetDeviceTypeMST> SheetDeviceTypes
                .HasForeignKey(sdt => sdt.DeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
