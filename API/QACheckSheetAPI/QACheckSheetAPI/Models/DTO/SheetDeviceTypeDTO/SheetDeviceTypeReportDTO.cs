namespace QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO
{
    public class SheetDeviceTypeReportDTO
    {
        public string? SheetCode { get; set; }
        public string? SheetName { get; set; }
        public string? DeviceCode { get; set; }
        public string? DeviceName { get; set; }
        public int? DefaultFrequency { get; set; }
        public int? FrequencyOverride { get; set; }
        public string? ConfirmedBy { get; set; }
        public string? ApprovedBy { get; set; }
    }
}
