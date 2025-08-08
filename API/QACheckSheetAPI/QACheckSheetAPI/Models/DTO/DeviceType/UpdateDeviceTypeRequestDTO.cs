namespace QACheckSheetAPI.Models.DTO.DeviceType
{
    public class UpdateDeviceTypeRequestDTO
    {
        public string TypeName { get; set; } = null!;
        public int? DefaultFrequency { get; set; }
        public string Description { get; set; } = string.Empty;
        public string UpdateBy { get; set; } = null!;
    }
}
