using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class ConfirmApprove
    {
        [Key]
        public int ConfirmApproveID { get; set; }
        [Required]
        public string ConfirmedBy { get; set; } = string.Empty;
        [Required]
        public DateTime ConfirmedDate { get; set; }
        public string ApprovedBy { get; set; } = string.Empty;
        public DateTime ApprovedDate { get; set; }
        [Required]
        public string SheetCode { get; set; } = null!;
        [Required]
        public string DeviceCode { get; set; } = null!;
    }
}
