using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestCertifications
    {
        public object IssueDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
