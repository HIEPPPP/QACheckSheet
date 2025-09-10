namespace QACheckSheetAPI.Models.DTO.NgDetail
{
    public class CreateNgDetaiRequestDTO
    {
        public long ResultId { get; set; }
        public string NGContentDetail { get; set; } = string.Empty; // Chi tiết nội dung NG
        public string FixContent { get; set; } = string.Empty; // Nội dung khắc phục
        public string FixedBy { get; set; } = string.Empty;
        public DateTime? FixedDate { get; set; }
    }
}
