namespace QACheckSheetAPI.Models.DTO.Auth
{
    public class ChangePasswordRequestDTO
    {
        public string UserCode { get; set; } = string.Empty;    
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
