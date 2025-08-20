namespace QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO
{
    public class CreateSheetDeviceTypeRequestDTO
    {
        public int SheetId { get; set; }
        public int DeviceTypeId { get; set; }
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
