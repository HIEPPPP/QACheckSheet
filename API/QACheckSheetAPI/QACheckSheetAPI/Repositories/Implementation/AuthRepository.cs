using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Repositories.Implementation
{
    public class AuthRepository : IAuthRepository   
    {
        private readonly QACheckSheetDBContext context;

        public AuthRepository(QACheckSheetDBContext context)
        {
            this.context = context;
        }

        public async Task<User?> AuthenticateAsync(string userCode, string password)
        {
            // Lấy user kèm roles
            var user = await context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)    // nếu bạn có navigation từ UserRole -> Role
                .FirstOrDefaultAsync(u => u.UserCode == userCode);

            if (user == null)
                return null;

            // So sánh mật khẩu (lưu PasswordHash là BCrypt)
            bool valid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return valid ? user : null;
        }

        public async Task<User?> GetByCodeAsync(string userCode)
        {
            return await context.Users
                                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                                .FirstOrDefaultAsync(u => u.UserCode == userCode);
        }

        public async Task<User?> GetByIdAsync(int userId)
        {
            return await context.Users
                                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                                .FirstOrDefaultAsync(u => u.UserId == userId);
        }       

        public async Task UpdatePasswordAsync(User user, string newHashedPassword)
        {
            user.PasswordHash = newHashedPassword;
            context.Users.Update(user);
            await context.SaveChangesAsync();   
        }
    }
}
