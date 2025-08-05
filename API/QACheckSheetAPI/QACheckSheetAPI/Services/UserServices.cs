using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.User;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class UserServices
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UserServices(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<UserDTO> CreateUserAsync(CreateUserRequestDTO dto)
        {
            // 1.Kiểm tra trùng userCode
            if (await userRepository.IsUserCodeExistsAsync(dto.UserCode))
            {
                throw new InvalidOperationException("UserCode đã tồn tại.");
            }
               
            // 2. Tạo entity User mới
            var user = new User
            {
                UserCode = dto.UserCode,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName
            };

            // 3. Gọi Repository để lưu + gán roles
            var created = await userRepository.CreateAsync(user, dto.RoleIds ?? Enumerable.Empty<int>());

            // 4. Map sang DTO trả về
            return mapper.Map<UserDTO>(created);
        }

        public async Task<List<UserDTO>> GetAllAsync()
        {
            var users = await userRepository.GetListAsync();
            return mapper.Map<List<UserDTO>>(users);
        }

        public async Task<UserDTO?> GetByIdAsync(int userId)
        {
            var user = await userRepository.GetAsync(userId);
            return user == null ? null : mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> UpdateAsync(int userId, UpdateUserRequestDTO dto)
        {
            var user = await userRepository.GetAsync(userId)
                       ?? throw new KeyNotFoundException("User không tồn tại");

            // Cập nhật các trường nếu được truyền
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName;
            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var updated = await userRepository.UpdateAsync(user, dto.RoleIds ?? Enumerable.Empty<int>());
            return mapper.Map<UserDTO>(updated);
        }

        public async Task DeleteAsync(int userId)
        {
            var user = await userRepository.GetAsync(userId)
                       ?? throw new KeyNotFoundException("User không tồn tại");
            await userRepository.DeleteAsync(user);
        }
    }
}
