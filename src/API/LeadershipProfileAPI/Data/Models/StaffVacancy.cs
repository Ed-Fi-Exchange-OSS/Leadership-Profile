using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data.Models
{
    [Keyless]
    public class StaffVacancy
    {
        public string StaffUniqueId { get; set; }
        public String FullNameAnnon { get; set; }
        public int Age { get; set; }
        public string SchoolNameAnnon { get; set; }
        public string SchoolLevel { get; set; }
        public string Gender { get; set; }
        public string Race { get; set; }
        public string VacancyCause { get; set; }
        public Double SchoolYear { get; set; }
        public string PositionTitle { get; set; }
        public bool RetElig { get; set; }
        public Double OverallScore { get; set; }
    }
}
