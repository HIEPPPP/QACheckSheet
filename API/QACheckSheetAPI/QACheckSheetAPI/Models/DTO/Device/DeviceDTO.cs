using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.DTO.Device
{
    public class DeviceDTO
    {
        public int DeviceId { get; set; }
        public int TypeId { get; set; }
        public string? SheetCode { get; set; }
        public string? SheetName { get; set; }
        public string TypeCode { get; set; } = null!;
        public string TypeName { get; set; } = null!;
        public string DeviceCode { get; set; } = null!;
        public string DeviceName { get; set; } = null!;
        public string SeriNumber { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Factory { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; //Tình trạng: Đang sử dụng, Bảo trì, Hỏng,...
        public int DefaultFrequency { get; set; } //Của DeviceType
        public int? FrequencyOverride { get; set; }
        public string Description { get; set; } = string.Empty;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string UpdateBy { get; set; } = null!;
        public DateTime UpdateAt { get; set; } = DateTime.Now;

    }
}
