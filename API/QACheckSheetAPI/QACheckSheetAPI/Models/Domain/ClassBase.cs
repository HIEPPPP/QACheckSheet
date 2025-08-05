using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class ClassBase
    {
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public bool CancelFlag { get; set; } = false;
    }
}
