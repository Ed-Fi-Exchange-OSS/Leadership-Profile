namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestQuery
    {
        public int? Page { get; set; }
        public string SortField { get; set; }
        public string SortBy { get; set; }
    }
}
