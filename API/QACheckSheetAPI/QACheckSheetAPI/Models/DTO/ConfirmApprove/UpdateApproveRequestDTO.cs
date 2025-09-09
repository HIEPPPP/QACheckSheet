namespace QACheckSheetAPI.Models.DTO.ConfirmApprove
{
    public class UpdateApproveRequestDTO
    {
        public int ConfirmApproveId { get; set; }
        public string ApprovedBy { get; set; } = string.Empty;
        public DateTime ApprovedDate { get; set; } = DateTime.Now;
    }
}
