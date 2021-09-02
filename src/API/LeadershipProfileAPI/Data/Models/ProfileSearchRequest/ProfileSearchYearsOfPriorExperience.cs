using System.Collections.Generic;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchYearsOfPriorExperience
    {
        public ICollection<Range> Values { get; set; }

        public class Range
        {
            public int Min { get; set; }
            public int Max { get; set; }
        }
    }
}