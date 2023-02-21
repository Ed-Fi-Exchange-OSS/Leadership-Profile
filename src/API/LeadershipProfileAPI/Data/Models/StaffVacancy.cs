using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data.Models
{
    [Keyless]
    public class StaffVacancy
    {
        // [Key]
        public String FullNameAnnon { get; set; }
        public string SchoolNameAnnon { get; set; }
        public string SchoolLevel { get; set; }
        // public DateTime? EndDate { get; set; }
        public string Gender { get; set; }
        public string Race { get; set; }
        public string VacancyCause { get; set; }
        public Double SchoolYear { get; set; }
        public string PositionTitle { get; set; }
        public string RetElig { get; set; }
        public Double OverallScore { get; set; }
    }
}
