namespace QACheckSheetAPI.Models.DTO.NgDetail
{
    public class UpdateNgDetailRequestDTO
    {
        public int NgId { get; set; }
        public string ConfirmedBy { get; set; } = string.Empty;
        public DateTime? ConfirmedDate { get; set; }
    }
}
