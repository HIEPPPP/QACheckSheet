using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.Sheet
{
    public class SheetDTO
    {
        public int SheetID { get; set; }
        public string SheetCode { get; set; } = null!;
        public string SheetName { get; set; } = null!;
        public string FormNO { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
