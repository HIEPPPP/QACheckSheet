using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.ConfirmApprove;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class ConfirmApproveServices
    {
        private readonly IConfirmApproveRepository confirmApproveRepository;
        private readonly IMapper mapper;

        public ConfirmApproveServices(IConfirmApproveRepository confirmApproveRepository, IMapper mapper)
        {
            this.confirmApproveRepository = confirmApproveRepository;
            this.mapper = mapper;
        }

        public async Task<ConfirmApproveDTO> CreateConfirm(CreateConfirmRequestDTO dto)
        {
            var domain = mapper.Map<ConfirmApprove>(dto);
            var created = await confirmApproveRepository.CreateConfirm(domain);
            return mapper.Map<ConfirmApproveDTO>(created);
        }

        public async Task<ConfirmApproveDTO> UpdateApprove(int confirmApproveId, UpdateApproveRequestDTO dto)
        {
            var exist = await confirmApproveRepository.GetAsync(confirmApproveId)
                                        ?? throw new KeyNotFoundException("DeviceType không tồn tại");

            exist.ApprovedDate = dto.ApprovedDate;
            exist.ApprovedBy = dto.ApprovedBy;
            await confirmApproveRepository.UpdateApprove(exist);
            return mapper.Map<ConfirmApproveDTO>(exist);
        }
    }
}
