using QACheckSheetAPI.Models.Domain;
using System.Threading.Tasks;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<bool> IsUserCodeExistsAsync(string userCode);
        Task<User?> CreateAsync(User user, IEnumerable<int> roleIds);
        Task<User?> UpdateAsync(User user, IEnumerable<int> roleIds);
        Task DeleteAsync(User user);
        Task<List<User>> GetListAsync();
        Task<User?> GetAsync(int userId);
    }
}
