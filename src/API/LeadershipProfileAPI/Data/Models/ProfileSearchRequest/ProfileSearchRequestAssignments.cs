using System.Collections.Generic;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestAssignments
    {
        public string StartDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
