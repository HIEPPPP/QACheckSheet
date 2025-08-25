using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface ICheckResultRepository
    {
        Task<CheckResult?> GetCheckResultByIdAsync(int resultId);
        Task<List<CheckResult>> CreateResultsAsync (List<CheckResult> results);
        Task<CheckResult> UpdateResult (CheckResult result);
        Task<List<CheckResult>> GetlistResultNG();
    }
}
