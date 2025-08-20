using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Repositories.Interface;
using System;

namespace QACheckSheetAPI.Services
{
    public class DeviceTypeServices
    {
        private readonly IDeviceTypeRepository deviceTypeRepository;
        private readonly IMapper mapper;

        public DeviceTypeServices(IDeviceTypeRepository deviceTypeRepository, IMapper mapper)
        {
            this.deviceTypeRepository = deviceTypeRepository;
            this.mapper = mapper;
        }

        public async Task<List<DeviceTypeMST>> GetListDeviceType()
        {
            var listDeviceType = await deviceTypeRepository.GetListAsync();
            return listDeviceType;
        } 

        public async Task<DeviceTypeDTO?> GetDeviceTypeById (int typeId)
        {
            var deviceType = await deviceTypeRepository.GetAsync(typeId);
            return deviceType == null ? null : mapper.Map<DeviceTypeDTO>(deviceType);
        }

        public async Task<DeviceTypeDTO> CreateDeviceType (CreateDeviceTypeRequestDTO dto)
        {
            //if(await deviceTypeRepository.IsTypeCodeExistAsync(dto.TypeCode))
            //{
            //    throw new Exception("TypeCode đã tồn tại");
            //}

            var typeDomain = mapper.Map<DeviceTypeMST>(dto);

            var created = await deviceTypeRepository.CreateAsync(typeDomain);

            return mapper.Map<DeviceTypeDTO>(created);
        }

        public async Task<DeviceTypeDTO> UpdateDeviceType(int typeId, UpdateDeviceTypeRequestDTO dto)
        {
            var type = await deviceTypeRepository.GetAsync(typeId)
                             ?? throw new KeyNotFoundException("DeviceType không tồn tại");
            // Cập nhật các trường nếu được truyền

            type.UpdateAt = DateTime.Now;
            
            if (!string.IsNullOrWhiteSpace(dto.TypeName))
                type.TypeName = dto.TypeName;
            if(!string.IsNullOrWhiteSpace(dto.Description))
                type.Description = dto.Description;
            if(dto.DefaultFrequency.HasValue)
                type.DefaultFrequency = dto.DefaultFrequency.Value;
            if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
                type.UpdateBy = dto.UpdateBy;
            
            await deviceTypeRepository.UpdateAsync(type);
            return mapper.Map<DeviceTypeDTO>(type);
        }

        public async Task DeleteDeviceType(int typeId)
        {
            var type = await deviceTypeRepository.GetAsync(typeId)
                             ?? throw new KeyNotFoundException("DeviceType không tồn tại");
            await deviceTypeRepository.DeleteAsync(type);
        }
    }
}
