using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QACheckSheetAPI.Models.Domain
{
    public class SheetItemMST : ClassBase
    {
        [Key]
        public int ItemID { get; set; }

        public int SheetID { get; set; }            
        [Required]
        [MaxLength(700)]
        public string Title { get; set; } = null!;
        public string ContentA { get; set; } = string.Empty;
        public string ContentB { get; set; } = string.Empty;
        public string ContentC { get; set; } = string.Empty;
        [Required]
        public string DataType { get; set; } = null!;
        public int OrderNumber { get; set; }
        public decimal Min { get; set; }
        public decimal Max { get; set; }
        public bool IsRequired { get; set; } = false;

        //Navigation Properties
        [ForeignKey("SheetID")]
        [JsonIgnore]
        public SheetMST SheetMST { get; set; } = null!;
    }
}
