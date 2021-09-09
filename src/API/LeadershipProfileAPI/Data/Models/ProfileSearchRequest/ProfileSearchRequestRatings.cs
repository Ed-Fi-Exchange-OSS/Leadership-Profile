namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestRatings
    {
        public string Category { get; set; }
        public float Score { get; set; }

        public bool IsPopulated => !string.IsNullOrWhiteSpace(Category);
    }
}
