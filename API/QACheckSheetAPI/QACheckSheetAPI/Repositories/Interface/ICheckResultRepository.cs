using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface ICheckResultRepository
    {
        Task<CheckResult?> GetCheckResultByIdAsync(int resultId);
        Task<List<CheckResult>> CreateResultsAsync (List<CheckResult> results);
        Task<CheckResult> UpdateResult (CheckResult result);
        Task UpdateResults (List<CheckResult> results);
        Task<List<NGDetailDTO>> GetlistResultNG();
        Task<List<CheckResult>> GetListResultDayBySDCode(string sheetCode, string deviceCode);
        Task<List<CheckResult>> GetListResultDayBySDCodeAndDate(string sheetCode, string deviceCode, DateTime dayRef);
        Task<List<CheckResult>> ConfirmResult(List<CheckResult> results);
        Task<List<CheckResult>> GetListReusltDay();
        //Report
        Task<List<ApproveConfirmResultDTO>> GetListResultApproveConfirmByMonth(DateTime monthRef);
        Task<List<SheetDeviceTypeReportDTO>> GetHeaderReport(string sheetCode, string deviceCode, DateTime monthRef);
        Task<List<ResultReportDTO>> GetResultReport(string sheetCode, string deviceCode, DateTime monthRef);
        Task<List<ResultNGDTO>> GetNGReport(string sheetCode, string deviceCode, DateTime monthRef);
    }
}
