using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class ConfirmApproveRepository : IConfirmApproveRepository
    {
        private readonly QACheckSheetDBContext context;

        public ConfirmApproveRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<ConfirmApprove> CreateConfirm(ConfirmApprove confirmApprove)
        {
            await context.AddAsync(confirmApprove);
            await context.SaveChangesAsync();
            return confirmApprove;
        }

        public async Task<ConfirmApprove?> GetAsync(int confirmApproveId)
        {
            return await context.ConfirmApproves.FirstOrDefaultAsync(x => x.ConfirmApproveId == confirmApproveId);
        }

        public async Task<ConfirmApprove> UpdateApprove(ConfirmApprove confirmApprove)
        {
            context.Update(confirmApprove);
            await context.SaveChangesAsync();
            return confirmApprove;
        }
    }
}
