using System;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffProfessionalDevelopment
    {
        /// <summary>PK</summary>
        public int StaffUsi { get; set; }

        /// <summary>PK</summary>
        public string ProfessionalDevelopmentTitle { get; set; }

        public string StaffUniqueId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public string Location { get; set; }
        public string AlignmentToLeadership { get; set; }
    }
}
