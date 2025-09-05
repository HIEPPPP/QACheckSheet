namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class ApproveConfirmResultDTO
    {
        public string? SheetCode { get; set; }
        public string? SheetName { get; set; }
        public string? DeviceCode { get; set; }
        public string? DeviceName { get; set; }
        public string? ConfirmedBy { get; set; }
        public string? ApprovedBy { get; set; }
    }
}
