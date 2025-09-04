using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetListRole();
    }
}
