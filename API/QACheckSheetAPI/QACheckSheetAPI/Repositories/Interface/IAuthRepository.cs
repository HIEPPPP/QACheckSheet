using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IAuthRepository
    {
        Task<User?> AuthenticateAsync(string userCode, string password);
        Task<User?> GetByIdAsync(int userId);
        Task UpdatePasswordAsync(User user, string newHashedPassword);
    }
}
