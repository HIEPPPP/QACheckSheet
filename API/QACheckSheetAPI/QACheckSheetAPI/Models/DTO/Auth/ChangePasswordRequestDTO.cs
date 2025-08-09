namespace QACheckSheetAPI.Models.DTO.Auth
{
    public class ChangePasswordRequestDTO
    {
        public int UserId { get; set; }           // ID của user muốn đổi mật khẩu
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
