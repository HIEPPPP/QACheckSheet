using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QACheckSheetAPI.Models.Domain
{
    public class UserRole
    {
        [Key]
        public int UserRoleID { get; set; }

        public int UserID { get; set; }
        public int RoleID { get; set; }

        // Navigation
        [ForeignKey("UserID")]
        public User User { get; set; } = null!;
        [ForeignKey("RoleID")]
        public Role Role { get; set; } = null!;
    }
}
