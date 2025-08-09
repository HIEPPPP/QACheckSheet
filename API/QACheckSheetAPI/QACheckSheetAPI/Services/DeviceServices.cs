using AutoMapper;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Device;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class DeviceServices
    {
        private readonly IDeviceRepository deviceRepository;
        private readonly IMapper mapper;

        public DeviceServices(IDeviceRepository deviceRepository, IMapper mapper)
        {
            this.deviceRepository = deviceRepository;
            this.mapper = mapper;
        }

        public async Task<List<DeviceDTO>> GetListDevice()
        {
            var listDevice = await deviceRepository.GetListAsync();
            return mapper.Map<List<DeviceDTO>>(listDevice);
        }

        public async Task<DeviceDTO?> GetDeviceById(int id)
        {
            var device = await deviceRepository.GetAsync(id);
            return device == null ? null : mapper.Map<DeviceDTO>(device);
        }

        public async Task<DeviceDTO> CreateDevice(CreateDeviceRequestDTO dto)   
        {
            if (await deviceRepository.IsDeviceCodeExistAsync(dto.DeviceCode))
                throw new Exception("DeviceCode đã tồn tại");

            var deviceDomain = mapper.Map<DeviceMST>(dto);  
            var created = await deviceRepository.CreateAsync(deviceDomain);
            return mapper.Map<DeviceDTO>(created);
        }

        public async Task<DeviceDTO> UpdateDevice(int id, UpdateDeviceRequestDTO dto)
        {   
            var device = await deviceRepository.GetAsync(id)
                ?? throw new Exception("Device không tồn tại");

            device.UpdateAt = DateTime.Now;
            if(dto.TypeId.HasValue)
                device.TypeId = dto.TypeId.Value;
            if(!string.IsNullOrWhiteSpace(dto.DeviceName))
                device.DeviceName = dto.DeviceName;
            if(dto.FrequencyOverride.HasValue)
                device.FrequencyOverride = dto.FrequencyOverride;
            if(!string.IsNullOrWhiteSpace(dto.Status))
                device.Status = dto.Status;
            if(!string.IsNullOrWhiteSpace(dto.Description)) 
                device.Description = dto.Description;
            if(!string.IsNullOrWhiteSpace(dto.SeriNumber))
                device.SeriNumber = dto.SeriNumber; 
            if(!string.IsNullOrWhiteSpace(dto.Model))
                device.Model = dto.Model;
            if(!string.IsNullOrWhiteSpace(dto.Factory))
                device.Factory = dto.Factory;
            if(!string.IsNullOrWhiteSpace(dto.UpdateBy))
                device.UpdateBy = dto.UpdateBy;

            await deviceRepository.UpdateAsync(device);
            return mapper.Map<DeviceDTO>(device);
        } 

        public async Task DeleteDevice(int deviceId)
        {
            var device = await deviceRepository.GetAsync(deviceId)
                            ?? throw new KeyNotFoundException("Device không tồn tại");
            await deviceRepository.DeleteAsync(device);
        }
    }
}
