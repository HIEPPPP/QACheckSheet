namespace QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO
{
    public class SheetDeviceTypeDTO
    {
        public int Id { get; set; }
        public int DeviceTypeId { get; set; }
        public int SheetId { get; set; }
        public string DeviceTypeCode { get; set; } = null!;
        public string DeviceTypeName { get; set; } = null!;
        public string SheetCode { get; set; } = null!;
        public string SheetName { get; set; } = null!;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
