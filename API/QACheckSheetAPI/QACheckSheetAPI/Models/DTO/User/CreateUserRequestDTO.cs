namespace QACheckSheetAPI.Models.DTO.User
{
    public class CreateUserRequestDTO
    {
        public string UserCode { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<int>? RoleIds { get; set; }    // Danh sách RoleID gán cho user
    }
}
