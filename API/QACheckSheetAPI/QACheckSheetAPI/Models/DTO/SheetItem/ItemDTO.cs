using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.SheetItem
{
    public class ItemDTO
    {
        public int ItemID { get; set; }
        public int SheetID { get; set; }
        public string SheetName { get; set; } = null!;
        public string SheetCode { get; set; } = null!;
        public string FormNO { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string ContentA { get; set; } = string.Empty;
        public string ContentB { get; set; } = string.Empty;
        public string ContentC { get; set; } = string.Empty;
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
