using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QACheckSheetAPI.Models.Domain
{
    public class DeviceMST : ClassBase
    {
        [Key]
        public int DeviceID { get; set; }
        [Required]
        public int TypeID { get; set; }
        [Required]
        [MaxLength(20)]
        public string DeviceCode { get; set; } = null!;
        [Required]
        [MaxLength(255)]
        public string DeviceName { get; set; } = null!;
        [MaxLength(50)]        
        public string SeriNumber { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Factory { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; //Tình trạng: Đang sử dụng, Bảo trì, Hỏng,...
        public int? FrequencyOverride { get; set; }
        public string Description { get; set; } = string.Empty;

        //Navigation Properties
        [ForeignKey("TypeID")]
        [JsonIgnore]
        public DeviceTypeMST DeviceTypeMST { get; set; } = null!;
            
        [NotMapped]
        public int EffectiveFrequency
        => FrequencyOverride ?? DeviceTypeMST.DefaultFrequency;
    }
}
