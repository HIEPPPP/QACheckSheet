namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class ItemTreeDTO
    {
        public int ItemId { get; set; }
        public int SheetId { get; set; }
        public int? ParentItemId { get; set; }
        public int OrderNumber { get; set; }
        public int Level { get; set; }

        public string Title { get; set; } = null!;
        public string DataType { get; set; } = null!;
        public decimal? Min { get; set; }
        public decimal? Max { get; set; }
        public bool IsRequired { get; set; }

        public string? PathIds { get; set; }
        public string? PathTitles { get; set; }

        public List<ItemTreeDTO> Children { get; set; } = new();
    }
}
