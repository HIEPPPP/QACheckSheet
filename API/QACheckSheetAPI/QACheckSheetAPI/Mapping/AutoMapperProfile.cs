using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Auth;
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
        }
    }
}
