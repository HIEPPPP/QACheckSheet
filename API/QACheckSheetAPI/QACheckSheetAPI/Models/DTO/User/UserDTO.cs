namespace QACheckSheetAPI.Models.DTO.User
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public string UserCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
