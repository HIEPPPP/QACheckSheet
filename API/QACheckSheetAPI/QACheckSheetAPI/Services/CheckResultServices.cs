using AutoMapper;
using Microsoft.Data.SqlClient;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.DeviceType;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
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
            if (!string.IsNullOrWhiteSpace(dto.Status))
                result.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
                result.UpdateBy = dto.UpdateBy;          

            await checkResultRepository.UpdateResult(result);
            return mapper.Map<CheckResultDTO>(result);

        }

        // Update Value
        public async Task<CheckResultDTO> UpdateValueOrStatus(int resultId, UpdateValueRequestDTO dto)
        {
            var result = await checkResultRepository.GetCheckResultByIdAsync(resultId)
                                ?? throw new KeyNotFoundException("Result không tồn tại");

            if (!string.IsNullOrWhiteSpace(dto.Value))
                result.Value = dto.Value;
            if (!string.IsNullOrWhiteSpace(dto.Status))
                result.Status = dto.Status;

            await checkResultRepository.UpdateResult(result);
            return mapper.Map<CheckResultDTO>(result);
        }

        public async Task<List<CheckResultDTO>> BulkUpdateCheckResults(List<UpdateCheckResultRequestDTO> dtoList)
        {
            if (dtoList == null || dtoList.Count == 0) return new List<CheckResultDTO>();

            // Lấy từng entity, cập nhật và lưu một lần (atomic)
            var updatedEntities = new List<CheckResult>();

            foreach (var dto in dtoList)
            {
                if (dto.ResultId == null)
                    throw new KeyNotFoundException("ResultId is required for bulk update");

                var result = await checkResultRepository.GetCheckResultByIdAsync(dto.ResultId.Value)
                             ?? throw new KeyNotFoundException($"ResultId {dto.ResultId} không tồn tại");

                result.UpdateAt = DateTime.Now;

                // Chỉ cập nhật nếu DTO có giá trị (giữ logic hiện có)
                if (!string.IsNullOrWhiteSpace(dto.Value))
                    result.Value = dto.Value;
                if (!string.IsNullOrWhiteSpace(dto.Status))
                    result.Status = dto.Status;
                if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
                    result.UpdateBy = dto.UpdateBy;

                updatedEntities.Add(result);
            }

            // Lưu tất cả (repository thực hiện SaveChanges một lần trong transaction)
            await checkResultRepository.UpdateResults(updatedEntities);

            // Map để trả về
            return mapper.Map<List<CheckResultDTO>>(updatedEntities);
        }

        // EDIT DATA
        public async Task<List<CheckResultDTO>> BulkEditCheckResults(List<EditCheckResultRequestDTO> dtoList)
        {
            if (dtoList == null || dtoList.Count == 0) return new List<CheckResultDTO>();

            // Lấy từng entity, cập nhật và lưu một lần (atomic)
            var updatedEntities = new List<CheckResult>();

            foreach (var dto in dtoList)
            {
                if (dto.ResultId == null)
                    throw new KeyNotFoundException("ResultId is required for bulk update");

                var result = await checkResultRepository.GetCheckResultByIdAsync(dto.ResultId.Value)
                             ?? throw new KeyNotFoundException($"ResultId {dto.ResultId} không tồn tại");

                result.UpdateAt = DateTime.Now;

                // Chỉ cập nhật nếu DTO có giá trị (giữ logic hiện có)
                if (!string.IsNullOrWhiteSpace(dto.Value))
                    result.Value = dto.Value;
                if (!string.IsNullOrWhiteSpace(dto.Status))
                    result.Status = dto.Status;
                if (!string.IsNullOrWhiteSpace(dto.UpdateBy))
                    result.UpdateBy = dto.UpdateBy;
                if (!string.IsNullOrWhiteSpace(dto.CheckedBy))
                    result.CheckedBy = dto.CheckedBy;
                if (!string.IsNullOrWhiteSpace(dto.ConfirmBy))
                    result.ConfirmBy = dto.ConfirmBy;

                updatedEntities.Add(result);
            }

            // Lưu tất cả (repository thực hiện SaveChanges một lần trong transaction)
            await checkResultRepository.UpdateResults(updatedEntities);

            // Map để trả về
            return mapper.Map<List<CheckResultDTO>>(updatedEntities);
        }

        public async Task<List<NGDetailDTO>> GetListResultNG()
        {
            var list = await checkResultRepository.GetlistResultNG();
            return list;
        }

        public async Task<List<CheckResult>> GetListResultDayBySDCode(string sheetCode, string deviceCode)
        {
            return await checkResultRepository.GetListResultDayBySDCode(sheetCode, deviceCode);
        }

        public async Task<List<CheckResult>> GetListResultDayBySDCodeAndDate(string sheetCode, string deviceCode, DateTime dayRef)
        {
            return await checkResultRepository.GetListResultDayBySDCodeAndDate(sheetCode, deviceCode, dayRef);
        }

        public async Task<List<CheckResult>> ConfirmResult(List<ConfirmResultRequestDTO> dto)
        {
            var resultsDomain = mapper.Map<List<CheckResult>>(dto);
            return await checkResultRepository.ConfirmResult(resultsDomain);
        }

        public async Task<List<CheckResult>> GetListResultDay()
        {
            return await checkResultRepository.GetListReusltDay();
        }

        //Report
        public async Task<List<ApproveConfirmResultDTO>> GetListResultApproveConfirmByMonth(DateTime monthRef)
        {
            return await checkResultRepository.GetListResultApproveConfirmByMonth(monthRef);
        }

        public async Task<List<SheetDeviceTypeReportDTO>> GetHeaderReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            return await checkResultRepository.GetHeaderReport(sheetCode, deviceCode, monthRef);
        }

        public async Task<List<ResultReportDTO>> GetResultReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            return await checkResultRepository.GetResultReport(sheetCode, deviceCode, monthRef);
        }

        public async Task<List<ResultNGDTO>> GetNGReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            return await checkResultRepository.GetNGReport(sheetCode, deviceCode, monthRef);
        }
    }
}
