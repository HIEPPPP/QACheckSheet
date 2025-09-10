namespace QACheckSheetAPI.Models.DTO.CheckResult
{
    public class UpdateValueRequestDTO
    {
        public int ResultId { get; set; }
        public string? Value { get; set; }
        public string? Status { get; set; }
    }
}
