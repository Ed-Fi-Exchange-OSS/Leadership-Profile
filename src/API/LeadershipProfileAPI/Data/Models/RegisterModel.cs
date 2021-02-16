using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class RegisterModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        [Required]
        public string StaffUniqueId { get; set; }
    }
}
