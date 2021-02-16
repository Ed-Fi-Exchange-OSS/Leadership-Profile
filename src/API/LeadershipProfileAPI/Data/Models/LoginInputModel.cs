using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class LoginInputModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
