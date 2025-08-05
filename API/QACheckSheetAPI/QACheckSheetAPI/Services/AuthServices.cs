using AutoMapper;
using QACheckSheetAPI.Models.DTO.Auth;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class AuthServices
    {
        private readonly IAuthRepository authRepository;
        private readonly IMapper mapper;

        public AuthServices(IAuthRepository authRepository, IMapper mapper)
        {
            this.authRepository = authRepository;
            this.mapper = mapper;
        }

        public async Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO dto)
        {
            var user = await authRepository.AuthenticateAsync(dto.UserCode, dto.Password);
            if (user == null) return null;
            
            return mapper.Map<LoginResponseDTO>(user);
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDTO dto)
        {
            // 1. Lấy user theo ID
            var user = await authRepository.GetByIdAsync(dto.UserID);
            if (user == null)
                throw new KeyNotFoundException("User không tồn tại.");

            // 2. Verify mật khẩu cũ
            bool validOld = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);
            if (!validOld)
                return false;

            // 3. Hash mật khẩu mới và cập nhật
            string newHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await authRepository.UpdatePasswordAsync(user, newHash);
            return true;
        }
    }
}
