using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.NgDetail;
using QACheckSheetAPI.Models.DTO.NgDetailDTO;
using QACheckSheetAPI.Repositories.Implementation;
using QACheckSheetAPI.Repositories.Interface;
using System;

namespace QACheckSheetAPI.Services
{
    public class NgDetailServices
    {
        private readonly INgDetailRepository ngDetailRepository;
        private readonly IMapper mapper;

        public NgDetailServices(INgDetailRepository ngDetailRepository, IMapper mapper)
        {
            this.ngDetailRepository = ngDetailRepository;
            this.mapper = mapper;
        }

        public async Task<List<NGDetail>> GetListNgDetail()
        {
            return await ngDetailRepository.GetListNgDetailAsync();
        }

        public async Task<NgDetailDTO> CreateNgDetail(CreateNgDetaiRequestDTO dto)
        {
            var ngDomail = mapper.Map<NGDetail>(dto);
            var created = await ngDetailRepository.CreateAsync(ngDomail);
            return mapper.Map<NgDetailDTO>(created);
        }

        public async Task<NgDetailDTO?> UpdateNgDetail(int ngId, UpdateNgDetailRequestDTO dto)
        {
            var ng = await ngDetailRepository.GetByIdAsync(ngId)
                             ?? throw new KeyNotFoundException("NG không tồn tại");

            // Cập nhật các trường nếu được truyền          
            ng.ConfirmedDate = dto.ConfirmedDate;
            if (!string.IsNullOrWhiteSpace(dto.ConfirmedBy))
                ng.ConfirmedBy = dto.ConfirmedBy;            

            await ngDetailRepository.UpdateAsync(ng);
            return mapper.Map<NgDetailDTO>(ng);
        }
    }
}
