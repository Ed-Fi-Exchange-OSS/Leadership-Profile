using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class VacancyProjectionModel
    {
        [Required]
        public string Role { get; set; }
        // [Required]
        // public string StaffUniqueId { get; set; }
    }
}
