namespace LeadershipProfileAPI.Infrastructure.Auth
{
    public class AuthSettings
    {
        public string AuthorityServer { get; set; }
        public string WebClient { get; set; }
        public string WebClientRedirectUri { get; set; }

        public string WebClientRedirectUriFull => $"{WebClient}{WebClientRedirectUri}";
    }
}
