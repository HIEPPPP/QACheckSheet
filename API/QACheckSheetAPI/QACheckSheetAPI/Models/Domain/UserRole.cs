using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class UserRole
    {
        [Key]
        public int UserRoleId { get; set; }

        public int UserId { get; set; }
        public int RoleId { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("RoleId")]
        public Role Role { get; set; } = null!;
    }
}
