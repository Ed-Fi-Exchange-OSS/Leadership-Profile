using System;

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfilePositionHistory
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string Role { get; set; }
        public string School { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
