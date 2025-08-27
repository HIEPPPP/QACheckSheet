using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class CheckResultRepository : ICheckResultRepository
    {
        private readonly QACheckSheetDBContext context;

        public CheckResultRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }        

        public async Task<List<CheckResult>> CreateResultsAsync(List<CheckResult> results)
        {
            await context.CheckResults.AddRangeAsync(results);
            await context.SaveChangesAsync();
            return results;
        }

        public Task<CheckResult?> GetCheckResultByIdAsync(int resultId)
        {
            return context.CheckResults.FirstOrDefaultAsync(x => x.ResultId == resultId);
        }

        public Task<List<CheckResult>> GetlistResultNG()
        {
            return context.CheckResults.Where(x => x.Status == "NG").ToListAsync();
        }

        public async Task<CheckResult> UpdateResult(CheckResult result)
        {
            context.CheckResults.Update(result);
            await context.SaveChangesAsync();
            return result;
        }
    }
}
