using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class DeviceTypeMST : ClassBase
    {
        [Key]
        public int TypeID { get; set; }
        [Required]
        [MaxLength(20)]
        public string TypeCode { get; set; } = null!;
        [Required]
        [MaxLength(255)]
        public string TypeName { get; set; } = null!;
        public int DefaultFrequency { get; set; }
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        //Navigation Properties
        public ICollection<DeviceMST> DeviceMSTs { get; set; } = null!; 
        public ICollection<SheetDeviceTypeMST> SheetDeviceTypeMSTs { get; set; } = null!;
    }
}
