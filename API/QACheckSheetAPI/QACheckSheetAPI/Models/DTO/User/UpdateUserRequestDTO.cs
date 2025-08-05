namespace QACheckSheetAPI.Models.DTO.User
{
    public class UpdateUserRequestDTO
    {
        public string? FullName { get; set; }
        public string? Password { get; set; }  
        public List<int>? RoleIds { get; set; }
    }
}
