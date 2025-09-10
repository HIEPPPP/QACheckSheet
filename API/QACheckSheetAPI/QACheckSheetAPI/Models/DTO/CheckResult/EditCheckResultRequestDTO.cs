namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    // EDIT DATA
    public class EditCheckResultRequestDTO
    {
        public int? ResultId { get; set; }
        public string Value { get; set; } = null!;
        public string? Status { get; set; }
        public string? CheckedBy { get; set; }
        public string? ConfirmBy { get; set; }
        public string UpdateBy { get; set; } = string.Empty;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
