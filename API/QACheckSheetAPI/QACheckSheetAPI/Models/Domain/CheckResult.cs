using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class CheckResult
    {
        [Key]
        public long ResultId { get; set; }
        // FK references
        public int? InstanceId { get; set; }    // link tới ChecklistInstance nếu có
        public int? SheetId { get; set; }
        public int? DeviceId { get; set; }
        public int? DeviceTypeId { get; set; }
        public int? ItemId { get; set; }        // link tới SheetItemMST logical (optional)

        // Sheet
        public string FormNO { get; set; } = string.Empty;
        public string SheetCode { get; set; } = string.Empty;
        public string SheetName { get; set; } = string.Empty;
        // DeviceType
        public string TypeCode { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty;
        // Device
        public string DeviceCode { get; set; } = string.Empty;
        public string DeviceName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Factory { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        // SheetItem
        public int? ParentItemId { get; set; }
        public string Title { get; set; } = string.Empty;        
        public int OrderNumber { get; set; }
        public int Level { get; set; }
        public string? PathTitles { get; set; }
        public string? DataType { get; set; }
        // Result
        [Required]
        public string? Value { get; set; }
        [StringLength(20)]         
        public string? Status { get; set; } // OK, NG, null
        [Required]
        public string CheckedBy { get; set; } = null!;
        [Required]
        public DateTime CheckedDate { get; set; }
        public string ConfirmBy { get; set; } = string.Empty;
        public DateTime? ConfirmDate { get; set; }
        public string UpdateBy { get; set; } = string.Empty;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
