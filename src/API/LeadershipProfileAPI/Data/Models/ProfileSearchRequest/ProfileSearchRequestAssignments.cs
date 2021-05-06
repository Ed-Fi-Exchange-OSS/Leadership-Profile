using System;
using System.Collections.Generic;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestAssignments
    {
        public DateTime? StartDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
