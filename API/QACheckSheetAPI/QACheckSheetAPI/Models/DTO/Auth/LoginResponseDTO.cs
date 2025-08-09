namespace QACheckSheetAPI.Models.DTO.Auth
{
    public class LoginResponseDTO
    {
        public int UserId { get; set; }
        public string UserCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
