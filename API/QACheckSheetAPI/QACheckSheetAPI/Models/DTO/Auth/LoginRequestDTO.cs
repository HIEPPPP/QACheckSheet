namespace QACheckSheetAPI.Models.DTO.Auth
{
    public class LoginRequestDTO
    {
        public string UserCode { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
