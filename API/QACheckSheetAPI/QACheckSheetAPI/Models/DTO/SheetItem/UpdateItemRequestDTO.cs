namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class UpdateItemRequestDTO
    {
        public int? SheetId { get; set; }
        public string Title { get; set; } = null!;        
        public string DataType { get; set; } = null!;
        public int? OrderNumber { get; set; }
        public decimal? Min { get; set; }
        public decimal? Max { get; set; }
        public bool? IsRequired { get; set; } = false;
        public string UpdateBy { get; set; } = null!;
    }
}
