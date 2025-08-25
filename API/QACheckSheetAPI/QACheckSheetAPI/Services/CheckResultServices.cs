using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
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

        public async Task<CheckResultDTO> UpdateCheckResult (int resultId, )
    }
}
