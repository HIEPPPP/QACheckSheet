namespace QACheckSheetAPI.Models.DTO.DeviceType
{
    public class CreateDeviceTypeRequestDTO
    {
        public string TypeCode { get; set; } = null!;
        public string TypeName { get; set; } = null!;
        public int? DefaultFrequency { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
