namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestBody
    {
        public int MinYears { get; set; }
        public int MaxYears { get; set; }
        public ProfileSearchRequestRatings Ratings { get; set; }
        public ProfileSearchRequestAssignments Assignments { get; set; }
        public ProfileSearchRequestDegrees Degrees { get; set; }
        public ProfileSearchRequestInstitution Institutions { get; set; }

        public string Name { get; set; }
    }
}
