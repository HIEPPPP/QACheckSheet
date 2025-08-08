using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class ClassBase
    {
        public DateTime CreateAt { get; set; }
        public string CreateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; }
        public string UpdateBy { get; set; } = null!;
        public bool CancelFlag { get; set; } = false;
    }
}
