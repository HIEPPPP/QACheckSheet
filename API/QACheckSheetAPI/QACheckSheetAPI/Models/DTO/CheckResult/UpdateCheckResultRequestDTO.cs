namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class UpdateCheckResultRequestDTO
    {
        public int? ResultId { get; set; }        
        public string Value { get; set; } = null!;       
        public string? Status { get; set; }
        public string UpdateBy { get; set; } = string.Empty;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
