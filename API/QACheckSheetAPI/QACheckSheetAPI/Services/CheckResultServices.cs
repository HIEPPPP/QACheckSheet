using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Repositories.Implementation;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class CheckResultServices
    {
        private readonly ICheckResultRepository checkResultRepository;
        private readonly IMapper mapper;

        public CheckResultServices(ICheckResultRepository checkResultRepository, IMapper mapper)
        {
            this.checkResultRepository = checkResultRepository;
            this.mapper = mapper;
        }

        public async Task<List<CheckResultDTO>> CreateCheckResult(List<CreateCheckResultRequestDTO> dto)
        {
            var resultDomain = mapper.Map<List<CheckResult>>(dto);
            var created = await checkResultRepository.CreateResultsAsync(resultDomain);
            return mapper.Map<List<CheckResultDTO>>(created);
        }

        public async Task<CheckResultDTO> UpdateCheckResult (int resultId, UpdateCheckResultRequestDTO dto)
        {
            var result = await checkResultRepository.GetCheckResultByIdAsync(resultId)
                                ?? throw new KeyNotFoundException("Result không tồn tại");
            result.UpdateAt = DateTime.Now;

            if (!string.IsNullOrWhiteSpace(dto.Value))
                result.Value = dto.Value;
            if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
                result.UpdateBy = dto.UpdateBy;            

            await checkResultRepository.UpdateResult(result);
            return mapper.Map<CheckResultDTO>(result);

        }

        public async Task<List<CheckResultDTO>> GetListResultNG()
        {
            var list = await checkResultRepository.GetlistResultNG();
            return mapper.Map<List<CheckResultDTO>>(list);
        }
    }
}
