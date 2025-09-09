namespace QACheckSheetAPI.Models.DTO.ConfirmApprove
{
    public class CreateConfirmRequestDTO
    {
        public string ConfirmedBy { get; set; } = string.Empty;
        public string SheetCode { get; set; } = string.Empty;
        public string? DeviceCode { get; set; } = string.Empty;
        public DateTime ConfirmedDate { get; set; } = DateTime.Now;
    }
}
