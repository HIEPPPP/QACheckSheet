using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.CheckResult;
using QACheckSheetAPI.Models.DTO.SheetDeviceTypeDTO;
using QACheckSheetAPI.Repositories.Interface;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        public async Task<List<NGDetailDTO>> GetlistResultNG()
        {
            var query = @"SELECT r.ResultId,
	                       ng.NgId,
	                       r.SheetCode,
	                       r.SheetName,
	                       r.DeviceCode,
	                       r.DeviceName,
	                       r.PathTitles,
                           r.DataType,
	                       r.CheckedBy,
	                       r.CheckedDate,
	                       r.Value,
	                       r.Status,
	                       ng.NGContentDetail,
	                       ng.FixContent,
	                       ng.FixedDate,
	                       ng.ConfirmedBy,
	                       ng.ConfirmedDate,
	                       ng.Note
	                       FROM CheckResults AS r
                    LEFT JOIN NGDetails AS ng ON r.ResultId = ng.ResultId
                    WHERE r.Status = 'NG'";
            return await context.Database.SqlQueryRaw<NGDetailDTO>(
                               query
                           ).ToListAsync();
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
                    item.ConfirmDate = DateTime.Now;
                }
            }

            await context.SaveChangesAsync();
            return existResults;
        }

        public async Task<List<CheckResult>> GetListReusltDay()
        {
            return await context.CheckResults.Where(x => x.CheckedDate.Date == DateTime.Now.Date).ToListAsync();
        }

        // Report
        // Lấy danh sách kết quả để xác nhận và phê duyệt
        public async Task<List<ApproveConfirmResultDTO>> GetListResultApproveConfirmByMonth(DateTime monthRef)
        {
            //DECLARE @MonthRef DATE = '2025-09-01'
            var query = @"SELECT
                                r.SheetName,
                                r.DeviceName,
                                r.SheetCode,
                                r.DeviceCode,
	                            c.ConfirmedBy,
	                            c.ApprovedBy
                            FROM CheckResults AS r
                            LEFT JOIN ConfirmApproves AS c ON r.SheetCode = c.SheetCode AND r.DeviceCode = c.DeviceCode
                            WHERE r.CheckedDate >= @MonthRef
                              AND r.CheckedDate <  DATEADD(MONTH, 1, @MonthRef)
                            GROUP BY
                                r.SheetName, r.DeviceName, r.SheetCode, r.DeviceCode, c.ConfirmedBy, c.ApprovedBy";

            return await context.Database.SqlQueryRaw<ApproveConfirmResultDTO>(
                               query,
                               new SqlParameter("@MonthRef", monthRef)
                           ).ToListAsync();
        }

        // Header Report
        public async Task<List<SheetDeviceTypeReportDTO>> GetHeaderReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            //DECLARE @MonthRef DATE = '2025-08-01'
            //DECLARE @DeviceCode VARCHAR(50) = 'DV6'
            //DECLARE @SheetCode VARCHAR(50) = 'CS4'

            var query = @"SELECT s.SheetCode,
                                   s.SheetName, 
                                   d.DeviceCode, 
                                   d.DeviceName, 
                                   dt.DefaultFrequency, 
                                   d.FrequencyOverride, 
                                   ca.ConfirmedBy, 
                                   ca.ApprovedBy 
                            FROM SheetDeviceTypes AS sdt
                            INNER JOIN Sheets AS s ON sdt.SheetId = s.SheetId
                            INNER JOIN DeviceTypes AS dt ON sdt.DeviceTypeId = dt.TypeId
                            INNER JOIN Devices AS d ON dt.TypeId = d.TypeId
                            LEFT JOIN ConfirmApproves AS ca 
	                                    ON d.DeviceCode = ca.DeviceCode 
	                                    AND s.SheetCode = ca.SheetCode 
	                                    AND ca.ConfirmedDate >= @MonthRef 
	                                    AND ca.ConfirmedDate < DATEADD(MONTH, 1, @MonthRef) 
	                                    AND ca.ApprovedDate >= @MonthRef 
	                                    AND ca.ApprovedDate < DATEADD(MONTH, 1, @MonthRef)
                            WHERE d.DeviceCode = @DeviceCode 
                                  AND s.SheetCode = @SheetCode";
            return await context.Database.SqlQueryRaw<SheetDeviceTypeReportDTO>(
                               query,
                               new SqlParameter("@SheetCode", sheetCode),
                               new SqlParameter("@DeviceCode", deviceCode),
                               new SqlParameter("@MonthRef", monthRef)
                           ).ToListAsync();
        }
    }
}
