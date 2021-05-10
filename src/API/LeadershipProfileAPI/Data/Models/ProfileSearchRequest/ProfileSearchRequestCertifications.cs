using System;
using System.Collections.Generic;
using Newtonsoft.Json.Serialization;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestCertifications
    {
        public DateTime? IssueDate { get; set; }
        public ICollection<int> Values { get; set; }
    }
}
