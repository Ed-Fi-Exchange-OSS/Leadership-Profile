using System;

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileEducation
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string MajorSpecialization { get; set; }
        public string MinorSpecialization { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
