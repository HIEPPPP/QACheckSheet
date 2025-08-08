namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class UpdateItemRequestDTO
    {
        public int SheetID { get; set; }
        public string Title { get; set; } = null!;
        public string ContentA { get; set; } = string.Empty;
        public string ContentB { get; set; } = string.Empty;
        public string ContentC { get; set; } = string.Empty;
        public string DataType { get; set; } = null!;
        public int OrderNumber { get; set; }
        public decimal Min { get; set; }
        public decimal Max { get; set; }
        public bool IsRequired { get; set; } = false;
        public string UpdateBy { get; set; } = null!;
    }
}
