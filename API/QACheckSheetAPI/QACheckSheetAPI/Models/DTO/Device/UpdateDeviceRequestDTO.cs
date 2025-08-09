namespace QACheckSheetAPI.Models.DTO.Device
{
    public class UpdateDeviceRequestDTO
    {
        public int? TypeId { get; set; }
        public string DeviceName { get; set; } = null!;
        public string SeriNumber { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Factory { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; //Tình trạng: Đang sử dụng, Bảo trì, Hỏng,...
        public int? FrequencyOverride { get; set; }
        public string Description { get; set; } = string.Empty;
        public string UpdateBy { get; set; } = null!;
    }
}
