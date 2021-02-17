using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class ResetPasswordModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
