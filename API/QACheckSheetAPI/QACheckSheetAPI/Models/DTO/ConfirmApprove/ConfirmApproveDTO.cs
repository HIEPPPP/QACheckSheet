using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.ConfirmApprove
{
    public class ConfirmApproveDTO
    {
        public int? ConfirmApproveId { get; set; }
        public string? ConfirmedBy { get; set; } = string.Empty;
        public DateTime? ConfirmedDate { get; set; }
        public string? ApprovedBy { get; set; } = string.Empty;
        public DateTime? ApprovedDate { get; set; }
        public string? SheetCode { get; set; } = null!;
        public string? DeviceCode { get; set; } = null!;
    }
}
