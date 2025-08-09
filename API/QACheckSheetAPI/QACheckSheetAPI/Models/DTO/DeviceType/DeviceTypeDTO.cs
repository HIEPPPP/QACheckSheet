using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.DeviceType
{
    public class DeviceTypeDTO
    {
        public int TypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public int DefaultFrequency { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;

    }
}
