namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class SheetGroupDTO
    {        
        public int SheetId { get; set; }
        public string? SheetName { get; set; }
        public string? SheetCode { get; set; }
        public List<ItemTreeDTO> Items { get; set; } = new();
        
    }
}
