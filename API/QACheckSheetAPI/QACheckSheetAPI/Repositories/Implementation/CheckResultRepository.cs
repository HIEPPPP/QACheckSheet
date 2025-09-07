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

        public async Task<List<ResultReportDTO>> GetResultReport(string sheetCode, string deviceCode, DateTime monthRef)
        {
            var query = @"-- Start/End của tháng
                            DECLARE @StartDate DATE = DATEFROMPARTS(YEAR(@MonthRef), MONTH(@MonthRef), 1);
                            DECLARE @EndDate   DATE   = DATEADD(MONTH, 1, @StartDate);

                            --------------------------------------------------------------------------------
                            -- 1) Lấy dữ liệu thô (map ký hiệu cho BOOLEAN)
                            --------------------------------------------------------------------------------
                            ;WITH Results AS (
                                SELECT
                                    cr.ItemId,
                                    cr.PathTitles,
                                    cr.OrderNumber,
                                    cr.Level,
                                    DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)) AS CheckedDay,
                                    cr.DataType,
                                    CASE 
                                        WHEN UPPER(ISNULL(cr.DataType,'')) = 'BOOLEAN' THEN
                                            CASE UPPER(ISNULL(cr.Value,'')) 
                                                WHEN 'OK'      THEN N'✓'
                                                WHEN 'NG'      THEN N'x'
                                                WHEN 'UPDATED' THEN N'o'
                                                ELSE cr.Value
                                            END
                                        ELSE cr.Value
                                    END AS ValueText,
                                    cr.CheckedBy,
                                    cr.ConfirmBy,
                                    COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) AS _EventDateTime -- để debug / tham chiếu
                                FROM CheckResults cr
                                WHERE cr.SheetCode  = @SheetCode
                                    AND cr.DeviceCode = @DeviceCode
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) >= @StartDate
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) <  @EndDate
                            ),

                            --------------------------------------------------------------------------------
                            -- 2) Tạo hàng Giờ kiểm tra: 1 row/ngày với thời gian (MIN datetime trong ngày) -> format HH:MM
                            --------------------------------------------------------------------------------
                            CheckerTime AS (
                                SELECT
                                    DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)) AS CheckedDay,
                                    N'Giờ kiểm tra' AS Content,
                                    -- Lấy MIN datetime trong ngày, format hh:mm (lấy 5 ký tự đầu của 108 = hh:mi:ss)
                                    LEFT(CONVERT(VARCHAR(8), MIN(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)), 108), 5) AS ValueText,
                                    1 AS GroupSort,
                                    -- sort path để giờ kiểm tra xuất trước Người kiểm tra
                                    'A|' + RIGHT('000' + ISNULL(CAST(MIN(cr.Level) AS VARCHAR(10)), '000'), 3) 
                                            + '|' + ISNULL(LEFT(CONVERT(VARCHAR(16), MIN(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)), 120), 16),'') 
                                            AS SortPath
                                FROM CheckResults cr
                                WHERE cr.SheetCode  = @SheetCode
                                    AND cr.DeviceCode = @DeviceCode
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) >= @StartDate
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) <  @EndDate
                                GROUP BY DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate))
                            ),

                            --------------------------------------------------------------------------------
                            -- 3) Dedupe ""Người kiểm tra"" và ""Người xác nhận"": 1 row/ngày
                            --------------------------------------------------------------------------------
                            CheckerDistinct AS (
                                SELECT
                                    DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)) AS CheckedDay,
                                    N'Người kiểm tra' AS Content,
                                    ISNULL(cr.CheckedBy, '') AS ValueText,
                                    1 AS GroupSort,
                                    'C|' + ISNULL(cr.CheckedBy,'') AS SortPath
                                FROM CheckResults cr
                                WHERE cr.SheetCode  = @SheetCode
                                    AND cr.DeviceCode = @DeviceCode
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) >= @StartDate
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) <  @EndDate
                                    AND ISNULL(cr.CheckedBy,'') <> ''
                                GROUP BY DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)), cr.CheckedBy

                            ),

                            ConfirmerDistinct AS (
                                SELECT
                                    DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)) AS CheckedDay,
                                    N'Người xác nhận' AS Content,
                                    ISNULL(cr.ConfirmBy, '') AS ValueText,
                                    2 AS GroupSort,
                                    'F|' + ISNULL(cr.ConfirmBy,'') AS SortPath
                                FROM CheckResults cr
                                WHERE cr.SheetCode  = @SheetCode
                                    AND cr.DeviceCode = @DeviceCode
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) >= @StartDate
                                    AND COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate) <  @EndDate
                                    AND ISNULL(cr.ConfirmBy,'') <> ''
                                GROUP BY DAY(COALESCE(cr.CheckedDate, cr.UpdateAt, cr.ConfirmDate)), cr.ConfirmBy
                            ),

                            --------------------------------------------------------------------------------
                            -- 4) Item rows: Content = PathTitles; SortPath từ Level + OrderNumber để sort theo Level rồi OrderNumber
                            --------------------------------------------------------------------------------
                            ItemRows AS (
                                SELECT
                                    r.CheckedDay,
                                    ISNULL(r.PathTitles, '') AS Content,
                                    r.ValueText,
                                    0 AS GroupSort,
                                    -- Pad Level + OrderNumber để sắp xếp lexicographically đúng: Level trước, sau đó OrderNumber
                                    RIGHT('000' + ISNULL(CAST(r.Level AS VARCHAR(10)), '000'), 3)
                                    + '.' +
                                    RIGHT('000' + ISNULL(CAST(r.OrderNumber AS VARCHAR(10)), '000'), 3)
                                    + '|' + ISNULL(r.PathTitles,'') AS SortPath
                                FROM Results r
                            ),

                            --------------------------------------------------------------------------------
                            -- 5) Gộp nguồn để pivot (ItemRows + CheckerTime + CheckerDistinct + ConfirmerDistinct)
                            --------------------------------------------------------------------------------
                            srcAll AS (
                                SELECT * FROM ItemRows
                                UNION ALL
                                SELECT CheckedDay, Content, ValueText, GroupSort, SortPath FROM CheckerTime
                                UNION ALL
                                SELECT CheckedDay, Content, ValueText, GroupSort, SortPath FROM CheckerDistinct
                                UNION ALL
                                SELECT CheckedDay, Content, ValueText, GroupSort, SortPath FROM ConfirmerDistinct
                            ),

                            --------------------------------------------------------------------------------
                            -- 6) Pivot days -> Day1..Day31
                            --------------------------------------------------------------------------------
                            pivoted AS (
                                SELECT
                                    GroupSort,
                                    Content,
                                    SortPath,
                                    [1],[2],[3],[4],[5],[6],[7],[8],[9],
                                    [10],[11],[12],[13],[14],[15],[16],[17],[18],[19],
                                    [20],[21],[22],[23],[24],[25],[26],[27],[28],
                                    [29],[30],[31]
                                FROM (
                                    SELECT GroupSort, Content, SortPath, CheckedDay, ValueText
                                    FROM srcAll
                                ) AS s
                                PIVOT (
                                    MAX(ValueText) FOR CheckedDay IN (
                                        [1],[2],[3],[4],[5],[6],[7],[8],[9],
                                        [10],[11],[12],[13],[14],[15],[16],[17],[18],[19],
                                        [20],[21],[22],[23],[24],[25],[26],[27],[28],
                                        [29],[30],[31]
                                    )
                                ) AS pvt
                            ),

                            --------------------------------------------------------------------------------
                            -- 7) Final select: Content + Day1..Day31, sắp xếp theo ưu tiên (Giờ kiểm tra lên đầu), GroupSort, SortPath
                            Final AS (
                                SELECT
                                    GroupSort, Content, SortPath,
                                    [1] AS Day1,[2] AS Day2,[3] AS Day3,[4] AS Day4,[5] AS Day5,[6] AS Day6,[7] AS Day7,[8] AS Day8,[9] AS Day9,
                                    [10]AS Day10,[11]AS Day11,[12]AS Day12,[13]AS Day13,[14]AS Day14,[15]AS Day15,[16]AS Day16,[17]AS Day17,[18]AS Day18,[19]AS Day19,
                                    [20]AS Day20,[21]AS Day21,[22]AS Day22,[23]AS Day23,[24]AS Day24,[25]AS Day25,[26]AS Day26,[27]AS Day27,[28]AS Day28,
                                    [29]AS Day29,[30]AS Day30,[31]AS Day31,
                                    -- Ưu tiên: Giờ kiểm tra lên đầu
                                    CASE WHEN Content = N'Giờ kiểm tra' THEN 0 ELSE 1 END AS SortPriority
                                FROM pivoted
                            )

                            SELECT
                                Content,
                                Day1,Day2,Day3,Day4,Day5,Day6,Day7,Day8,Day9,
                                Day10,Day11,Day12,Day13,Day14,Day15,Day16,Day17,Day18,Day19,
                                Day20,Day21,Day22,Day23,Day24,Day25,Day26,Day27,Day28,
                                Day29,Day30,Day31
                            FROM Final
                            WHERE NOT (ISNULL(Content,'') = '' 
                                        AND ISNULL(Day1,'') = '' AND ISNULL(Day2,'') = '' )
                            ORDER BY SortPriority, GroupSort, SortPath
                            OPTION (MAXRECURSION 0);";
            return await context.Database.SqlQueryRaw<ResultReportDTO>(
                               query,
                               new SqlParameter("@SheetCode", sheetCode),
                               new SqlParameter("@DeviceCode", deviceCode),
                               new SqlParameter("@MonthRef", monthRef)
                           ).ToListAsync();
        }
    }
}
