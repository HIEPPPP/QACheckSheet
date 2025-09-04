using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class RoleServices
    {
        private readonly IRoleRepository roleRepository;

        public RoleServices(IRoleRepository roleRepository)
        {
            this.roleRepository = roleRepository;
        }
        
        public async Task<List<Role>> GetListRole()
        {
            return await roleRepository.GetListRole();
        }
    }
}
