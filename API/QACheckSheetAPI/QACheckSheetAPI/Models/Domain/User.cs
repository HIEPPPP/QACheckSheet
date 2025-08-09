using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [MaxLength(100)]
        public string UserCode { get; set; } = string.Empty;
        [MaxLength(100)]
        public string PasswordHash { get; set; } = string.Empty;
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
