namespace QACheckSheetAPI.Models.DTO.Sheet
{
    public class UpdateSheetRequestDTO
    {
        public string SheetName { get; set; } = null!;
        public string FormNO { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string UpdateBy { get; set; } = null!;

    }
}
