using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestAssignments
    {
        public string StartDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
