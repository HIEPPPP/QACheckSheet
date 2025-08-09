using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class SheetMST : ClassBase
    {
        [Key]
        public int SheetId { get; set; }
        [Required]
        [MaxLength(20)]
        public string SheetCode { get; set; } = null!;
        [Required]
        [MaxLength(500)]
        public string SheetName { get; set; } = null!;
        [Required]
        [MaxLength(50)]
        public string FormNO { get; set; } = null!;
        public string Description { get; set; } = string.Empty;

        //Navigation Properties
        public ICollection<SheetItemMST> SheetItemMSTs { get; set; } = new List<SheetItemMST>();
        public ICollection<SheetDeviceTypeMST> SheetDeviceTypeMSTs { get; set; } = new List<SheetDeviceTypeMST>();
    }
}
