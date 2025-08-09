using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QACheckSheetAPI.Models.Domain
{
    public class SheetItemMST : ClassBase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ItemId { get; set; }

        [Required]
        public int SheetId { get; set; }

        public int? ParentItemId { get; set; }

        [Required]
        [MaxLength(700)]
        public string Title { get; set; } = null!;

        public int OrderNumber { get; set; } // Số thứ tự hiển thị cùng parent

        public int Level { get; set; } // Độ sâu của root

        [MaxLength(500)]
        public string? PathIds { get; set; }      // "/1/4/10"

        [MaxLength(2000)]
        public string? PathTitles { get; set; }   // "A > B > C"

        public bool IsActive { get; set; } = true;
       
        [Required]
        public string DataType { get; set; } = null!;

        public decimal? Min { get; set; }
        public decimal? Max { get; set; }

        public bool IsRequired { get; set; } = false;

        // Self-reference navigation
        [ForeignKey(nameof(ParentItemId))]
        public SheetItemMST? Parent { get; set; }

        public ICollection<SheetItemMST> Children { get; set; } = new List<SheetItemMST>();

        [NotMapped]
        public bool IsLeaf => Children == null || Children.Count == 0;

        // Navigation to sheet
        [ForeignKey(nameof(SheetId))]
        [JsonIgnore]
        public SheetMST SheetMST { get; set; } = null!;       
    }
}
