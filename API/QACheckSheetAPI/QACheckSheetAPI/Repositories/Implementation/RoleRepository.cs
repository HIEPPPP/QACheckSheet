using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class RoleRepository : IRoleRepository
    {
        private readonly QACheckSheetDBContext context;

        public RoleRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }
        public async Task<List<Role>> GetListRole()
        {
            return await context.Roles.AsNoTracking().ToListAsync();
        }
    }
}
