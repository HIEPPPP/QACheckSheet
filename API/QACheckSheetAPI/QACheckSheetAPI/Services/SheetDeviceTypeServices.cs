using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
using QACheckSheetAPI.Repositories.Implementation;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class SheetDeviceTypeServices
    {
        private readonly ISheetDeviceTypeRepository sheetDeviceTypeRepository;
        private readonly IMapper mapper;

        public SheetDeviceTypeServices(ISheetDeviceTypeRepository sheetDeviceTypeRepository, IMapper mapper)
        {
            this.sheetDeviceTypeRepository = sheetDeviceTypeRepository;
            this.mapper = mapper;
        }

        public async Task<List<SheetDeviceTypeDTO>> GetListSheetDeviceType()
        {
            var listSheetDevice = await sheetDeviceTypeRepository.GetListAsync();
            return mapper.Map<List<SheetDeviceTypeDTO>>(listSheetDevice);
        }

        public async Task<SheetDeviceTypeDTO?> GetSheetDeviceTypeById(int id)
        {
            var sheetDeviceType = await sheetDeviceTypeRepository.GetAsync(id);
            return sheetDeviceType == null ? null : mapper.Map<SheetDeviceTypeDTO>(sheetDeviceType);
        }

        public async Task<SheetDeviceTypeDTO> CreateSheetDeviceType(CreateSheetDeviceTypeRequestDTO dto)
        {
            if (await sheetDeviceTypeRepository.IsSheetDeviceTypeExistAsync(dto.DeviceTypeId, dto.SheetId))
            {
                throw new Exception("SheetDeviceType đã tồn tại");
            }
            var domain = mapper.Map<SheetDeviceTypeMST>(dto);
            var created = await sheetDeviceTypeRepository.CreateAsync(domain);
            return mapper.Map<SheetDeviceTypeDTO>(created);
        }

        public async Task<SheetDeviceTypeDTO> UpdateSheetDeviceType(int id, UpdateSheetDeviceTypeRequestDTO dto)
        {
            var type = await sheetDeviceTypeRepository.GetAsync(id)
                             ?? throw new KeyNotFoundException("SheetDeviceType không tồn tại");
            // Cập nhật các trường nếu được truyền

            type.UpdateAt = DateTime.Now;

            if (dto.SheetId.HasValue)
                type.SheetId = dto.SheetId.Value;
            if (dto.DeviceTypeId.HasValue)
                type.SheetId = dto.DeviceTypeId.Value;

            await sheetDeviceTypeRepository.UpdateAsync(type);
            return mapper.Map<SheetDeviceTypeDTO>(type);
        }

        public async Task DeleteSheetDeviceType(int id)
        {
            var type = await sheetDeviceTypeRepository.GetAsync(id)
                             ?? throw new KeyNotFoundException("SheetDeviceType không tồn tại");
            await sheetDeviceTypeRepository.DeleteAsync(type);
        }
    }
}
