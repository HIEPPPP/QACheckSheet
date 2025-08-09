using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.User;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly QACheckSheetDBContext context;

        public UserRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<bool> IsUserCodeExistsAsync(string userCode)
        {
            return await context.Users.AnyAsync(u => u.UserCode == userCode);
        }        

        public async Task<User?> CreateAsync(User user, IEnumerable<int> roleIds)
        {
            // gán các UserRole
            foreach (var rid in roleIds)
            {
                user.UserRoles.Add(new UserRole { RoleId = rid });
            }
            user.CreatedAt = DateTime.Now;
            context.Users.Add(user);
            await context.SaveChangesAsync();
            return await context.Users
                                .Include(u => u.UserRoles)
                                .ThenInclude(ur => ur.Role)
                                .FirstOrDefaultAsync(u => u.UserId == user.UserId);
        }

        public async Task DeleteAsync(User user)
        {
            context.Users.Remove(user);
            await context.SaveChangesAsync();
        }

        public async Task<User?> GetAsync(int userId)
        {
            return await context.Users
                                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<List<User>> GetListAsync()
        {
            return await context.Users
                                .Include(u => u.UserRoles)
                                .ThenInclude(ur => ur.Role)
                                .ToListAsync();
        }

        public async Task<User?> UpdateAsync(User user, IEnumerable<int> roleIds)
        {
            // Cập nhật các field nếu có
            context.Users.Update(user);
            // Xóa các UserRole cũ
            context.UserRoles.RemoveRange(user.UserRoles);
            // Gán lại
            user.UserRoles = roleIds.Select(rid => new UserRole { UserId = user.UserId, RoleId = rid }).ToList();
            await context.SaveChangesAsync();
            return user;
        }
    }
}
