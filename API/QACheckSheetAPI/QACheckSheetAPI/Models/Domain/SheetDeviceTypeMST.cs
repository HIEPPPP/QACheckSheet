using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QACheckSheetAPI.Models.Domain
{
    public class SheetDeviceTypeMST : ClassBase
    {
        [Key]
        public int Id { get; set; }
        public int SheetId { get; set; }
        public int DeviceTypeId { get; set; }

        //Navigation Properties
        [ForeignKey("SheetId")]
        [JsonIgnore] 
        public SheetMST SheetMST { get; set; } = null!;
        [ForeignKey("DeviceTypeId")]
        [JsonIgnore] 
        public DeviceTypeMST DeviceTypeMST { get; set; } = null!;
    }
}
