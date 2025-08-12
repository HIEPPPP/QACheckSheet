using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Auth;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.Sheet;
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
            CreateMap<SheetItemMST, ItemDTO>().ReverseMap();
            CreateMap<SheetItemMST, CreateItemRequestDTO>().ReverseMap();

        }
    }
}
