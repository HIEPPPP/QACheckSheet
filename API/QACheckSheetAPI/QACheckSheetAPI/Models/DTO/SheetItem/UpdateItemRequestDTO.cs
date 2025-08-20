namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class UpdateItemRequestDTO
    {
        public string Title { get; set; } = null!;        
        public string DataType { get; set; } = null!;
        public decimal? Min { get; set; }
        public decimal? Max { get; set; }
        public bool? IsRequired { get; set; } = false;
        public string UpdateBy { get; set; } = null!;
    }
}
