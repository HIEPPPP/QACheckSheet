using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Auth;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.Sheet;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
using QACheckSheetAPI.Models.DTO.SheetItem;
using QACheckSheetAPI.Models.DTO.User;

namespace QACheckSheetAPI.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() 
        {
            // Auth
            CreateMap<User, LoginResponseDTO>()
                .ForMember(dest => dest.Roles,
                            opt => opt.MapFrom(src =>
                                src.UserRoles.Select(ur => ur.Role!.RoleName))).ReverseMap();
            CreateMap<LoginRequestDTO, User>().ReverseMap();

            // User
            CreateMap<User, UserDTO>()
               .ForMember(dest => dest.Roles,
                           opt => opt.MapFrom(src =>
                              src.UserRoles.Select(ur => ur.Role!.RoleName))).ReverseMap();

            // DeviceType
            CreateMap<DeviceTypeMST, DeviceTypeDTO>().ReverseMap();
            CreateMap<DeviceTypeMST, CreateDeviceTypeRequestDTO>().ReverseMap();

            // Device
            CreateMap<DeviceMST, DeviceDTO>()
                .ForMember(dest => dest.TypeCode, opt => opt.MapFrom(src => src.DeviceTypeMST.TypeCode))
                .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.DeviceTypeMST.TypeName))
                .ForMember(dest => dest.DefaultFrequency, opt => opt.MapFrom(src => src.DeviceTypeMST.DefaultFrequency));
            CreateMap<DeviceMST, CreateDeviceRequestDTO>().ReverseMap();

            // Sheet
            CreateMap<SheetMST, SheetDTO>().ReverseMap();
            CreateMap<SheetMST, CreateSheetRequestDTO>().ReverseMap();

            // SheetItem
            CreateMap<SheetItemMST, ItemDTO>()
                .ForMember(dest => dest.SheetCode, otp => otp.MapFrom(src => src.SheetMST.SheetCode))
                .ForMember(dest => dest.SheetName, otp => otp.MapFrom(src => src.SheetMST.SheetName))
                .ForMember(dest => dest.FormNO, otp => otp.MapFrom(src => src.SheetMST.FormNO));
            CreateMap<SheetItemMST, CreateItemRequestDTO>().ReverseMap()
                .ForMember(dest => dest.ItemId, opt => opt.Ignore())
                .ForMember(dest => dest.PathIds, opt => opt.Ignore())
                .ForMember(dest => dest.PathTitles, opt => opt.Ignore())
                .ForMember(dest => dest.Level, opt => opt.Ignore())
                .ForMember(dest => dest.CreateAt, opt => opt.Ignore()); // Bỏ qua 
            CreateMap<SheetItemMST, ItemTreeDTO>().ReverseMap();

            // Nếu có trường trong Entity không có trong DTO, AutoMapper mặc định vẫn cố map, nhưng vì không tìm thấy source, nó set giá trị mặc định(null, 0, ...).
            // .Ignore() đảm bảo AutoMapper không động tới các field đó, để tránh override giá trị mặc định do code hoặc DB set.

            // SheetDeviceType
            CreateMap<SheetDeviceTypeMST, SheetDeviceTypeDTO>()
                .ForMember(dest => dest.DeviceTypeCode, otp => otp.MapFrom(src => src.DeviceTypeMST.TypeCode))
                .ForMember(dest => dest.DeviceTypeName, otp => otp.MapFrom(src => src.DeviceTypeMST.TypeName))
                .ForMember(dest => dest.SheetCode, otp => otp.MapFrom(src => src.SheetMST.SheetCode))
                .ForMember(dest => dest.SheetName, otp => otp.MapFrom(src => src.SheetMST.SheetName));
            CreateMap<SheetDeviceTypeMST, CreateSheetDeviceTypeRequestDTO>().ReverseMap();
        }
    }
}
