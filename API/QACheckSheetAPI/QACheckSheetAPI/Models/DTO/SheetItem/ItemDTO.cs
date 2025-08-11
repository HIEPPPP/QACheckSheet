using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class ItemDTO
    {
        public int ItemId { get; set; }
        public int SheetId { get; set; }
        public string SheetName { get; set; } = null!;
        public string SheetCode { get; set; } = null!;
        public int ParentItemId { get; set; }
        public int Level { get; set; }
        public string? PathIds { get; set; }
        public string? PathTitles { get; set; }
        public string FormNO { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string DataType { get; set; } = null!;
        public int OrderNumber { get; set; }
        public decimal Min { get; set; }
        public decimal Max { get; set; }
        public bool IsRequired { get; set; } = false;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
