using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QACheckSheetAPI.Models.Domain
{
    public class SheetDeviceTypeMST
    {
        [Key]
        public int SheetID { get; set; }
        public int DeviceTypeID { get; set; }

        //Navigation Properties
        [ForeignKey("SheetID")]
        [JsonIgnore] 
        public SheetMST SheetMST { get; set; } = null!;
        [ForeignKey("DeviceTypeID")]
        [JsonIgnore] 
        public DeviceTypeMST DeviceTypeMST { get; set; } = null!;
    }
}
