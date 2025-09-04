using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class NgDetailRepository : INgDetailRepository
    {
        private readonly QACheckSheetDBContext context;

        public NgDetailRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<NGDetail> CreateAsync(NGDetail nGDetail)
        {
            await context.NGDetails.AddAsync(nGDetail);
            await context.SaveChangesAsync();
            return nGDetail;
        }

        public Task<List<NGDetail>> GetListNgDetailAsync()
        {
            return context.NGDetails.Include(x => x.CheckResult)
                                    .Where(x => x.CheckResult.Status == "NG")
                                    .AsNoTracking().ToListAsync();
        }

        public async Task<NGDetail> UpdateAsync(NGDetail nGDetail)
        {
            context.Update(nGDetail);
            await context.SaveChangesAsync();
            return nGDetail;
        }
    }
}
