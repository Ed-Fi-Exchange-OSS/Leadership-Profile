using System.Collections.Generic;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestCertifications
    {
        public string IssueDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
