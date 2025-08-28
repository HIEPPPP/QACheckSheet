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
        public async Task UpdateResults(List<CheckResult> results)
        {
            if (results == null || results.Count == 0) return;

            using (var tx = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Entities đã được load và tracked trước đó trong service.
                    // Chỉ cần SaveChanges một lần để persist tất cả thay đổi.
                    await context.SaveChangesAsync();
                    await tx.CommitAsync();
                }
                catch
                {
                    await tx.RollbackAsync();
                    throw;
                }
            }
        }

        public Task<List<CheckResult>> GetListResultDayBySDCode(string sheetCode, string deviceCode)
        {
            var today = DateTime.Now.Date;
            var list = context.CheckResults
                              .Where(x => x.SheetCode == sheetCode 
                                            && x.DeviceCode == deviceCode 
                                            && x.CheckedDate.Date == today).ToListAsync();
            return list;
        }

        public async Task<List<CheckResult>> ConfirmResult(List<CheckResult> results)
        {
            var ids = results.Select(r => r.ResultId).ToList();

            var existResults = await context.CheckResults
                                            .Where(r => ids.Contains(r.ResultId))
                                            .ToListAsync();

            foreach (var item in existResults)
            {
                var updateItem = results.FirstOrDefault(u => u.ResultId == item.ResultId);
                if (updateItem != null)
                {
                    item.ConfirmBy = updateItem.ConfirmBy;
                }
            }

            await context.SaveChangesAsync();
            return existResults;
        }
        
    }
}
