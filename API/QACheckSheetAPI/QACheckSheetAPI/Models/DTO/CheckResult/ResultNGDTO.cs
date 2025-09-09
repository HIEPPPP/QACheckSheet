namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class ResultNGDTO
    {
        public long? ResultId { get; set; }
        public DateTime CheckedDate { get; set; }
        public string? PathTitles { get; set; } = string.Empty;
        public string? NGContentDetail { get; set; } = string.Empty;
        public string? FixContent { get; set; } = string.Empty;
        public string? Status { get; set; } = string.Empty;
        public string? FixedBy { get; set; } = string.Empty;
        public string? ConfirmedBy { get; set; } = string.Empty;
    }
}