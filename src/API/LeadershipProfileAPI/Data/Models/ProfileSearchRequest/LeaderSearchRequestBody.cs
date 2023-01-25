namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class LeaderSearchRequestBody
    {        
        public int[] Roles { get; set; }
        public int[] SchoolLevels { get; set; }
        public int[] HighestDegrees { get; set; }
        public int[] HasCertification { get; set; }
        public int[] OverallScore { get; set; }
    }
}
