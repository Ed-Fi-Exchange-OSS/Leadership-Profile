using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class ForgotPasswordModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string StaffUniqueId { get; set; }
    }
}
