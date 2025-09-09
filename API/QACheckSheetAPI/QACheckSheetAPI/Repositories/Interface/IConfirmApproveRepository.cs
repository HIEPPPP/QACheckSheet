using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IConfirmApproveRepository
    {
        Task<ConfirmApprove> CreateConfirm(ConfirmApprove confirmApprove);
        Task<ConfirmApprove> UpdateApprove(ConfirmApprove confirmApprove);
        Task<ConfirmApprove?> GetAsync(int confirmApproveId);
    }
}
