using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestBody
    {
        public int MinYears { get; set; }
        public int MaxYears { get; set; }
        public ProfileSearchRequestRatings Ratings { get; set; }
        public ProfileSearchRequestCertifications Certifications { get; set; }
        public ProfileSearchRequestAssignments Assignments { get; set; }
        public ProfileSearchRequestDegrees Degrees { get; set; }
    }
}
