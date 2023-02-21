namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class LeaderSearchRequestBody
    {        
        public int[] Roles { get; set; }
        public int[] SchoolLevels { get; set; }
        public int[] HighestDegrees { get; set; }
        public int[] HasCertification { get; set; }
        public int[] YearsOfExperience { get; set; }
        public int[] OverallScore { get; set; }
        public int[] DomainOneScore { get; set; }
        public int[] DomainTwoScore { get; set; }
        public int[] DomainThreeScore { get; set; }
        public int[] DomainFourScore { get; set; }
        public int[] DomainFiveScore { get; set; }
    }
}
