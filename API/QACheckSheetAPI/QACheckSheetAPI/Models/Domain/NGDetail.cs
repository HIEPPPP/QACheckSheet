using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QACheckSheetAPI.Models.Domain
{
    public class NGDetail
    {
        [Key]
        public int NgId { get; set; }
        [Required]
        public long ResultId { get; set; }
        [MaxLength(700)]
        public string NGContentDetail { get; set; } = string.Empty; // Chi tiết nội dung NG
        [MaxLength(700)]
        public string FixContent { get; set; } = string.Empty; // Nội dung khắc phục
        public string FixedBy { get; set; } = string.Empty;
        public DateTime? FixedDate { get; set; }
        public string ConfirmedBy { get; set; } = string.Empty;
        public DateTime? ConfirmedDate { get; set; }
        public string Note { get; set; } = string.Empty;

        //Navigation
        [ForeignKey("ResultId")]
        public CheckResult? CheckResult { get; set; }
    }
}
