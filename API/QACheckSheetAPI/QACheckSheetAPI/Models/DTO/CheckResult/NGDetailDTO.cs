namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class NGDetailDTO
    {
        public long? ResultId { get; set; }

        // Sheet
        public string? SheetCode { get; set; } = string.Empty;
        public string? SheetName { get; set; } = string.Empty;
       
        // Device
        public string? DeviceCode { get; set; } = string.Empty;
        public string? DeviceName { get; set; } = string.Empty;       
        public string? PathTitles { get; set; }
        public string? DataType { get; set; }
        // Result
        public string? Value { get; set; } = null!;
        public string? Status { get; set; }
        public decimal? Min { get; set; }
        public decimal? Max { get; set; }
        public string? CheckedBy { get; set; } = null!;
        public DateTime? CheckedDate { get; set; }
        //public string ConfirmBy { get; set; } = string.Empty;
        //public DateTime? ConfirmDate { get; set; }
        //public string UpdateBy { get; set; } = string.Empty;
        //public DateTime UpdateAt { get; set; } = DateTime.Now;

        // NGDetail
        public int? NgId { get; set; }
        public string? NGContentDetail { get; set; }
        public string? FixContent { get; set; }
        public DateTime? FixedDate { get; set; }
        public string? FixedBy { get; set; }
        public string? ConfirmedBy { get; set; }
        public DateTime? ConfirmedDate { get; set; }
        public string? Note { get; set; }
    }
}
