namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class UpdateCheckResultRequestDTO
    {
        public int? ResultId { get; set; }
        
        // Result
        public string Value { get; set; } = null!;       
        public string UpdateBy { get; set; } = string.Empty;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
