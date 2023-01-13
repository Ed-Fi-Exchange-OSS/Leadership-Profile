using System.ComponentModel.DataAnnotations;

namespace LeadershipProfileAPI.Data.Models
{
    public class VacancyRateModel
    {
        [Required]
        public string Role { get; set; }
    }
}
