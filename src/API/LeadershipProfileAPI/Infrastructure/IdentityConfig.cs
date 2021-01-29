using System.Collections.Generic;
using IdentityServer4;
using IdentityServer4.Models;

namespace LeadershipProfileAPI.Infrastructure
{
    public class IdentityConfig
    {
        public static string ApiName = "TPDM_API";

        public static IEnumerable<IdentityResource> IdentityResources =>
            new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
               new("roles", " user roles", new List<string>(){"role"})

            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new(ApiName, ApiName)
            };

        public static IEnumerable<Client> GetClient(string redirectUri, ICollection<string> allowCorsOrigin)
        {   
            return new List<Client>
            {
                // machine to machine client
                new()
                {
                    ClientId = "client",
                    ClientSecrets = {new Secret("secret".Sha256())},

                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    // scopes that client has access to
                    AllowedScopes = {ApiName},

                    RequireConsent = false
                },
                new()
                {
                    ClientId = "interactive",
                    ClientSecrets = {new Secret("secret".Sha256())},
                    ClientName = "code Client",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false,
                    ///account/login
                    RedirectUris = {redirectUri}, //should be our home page
                    PostLogoutRedirectUris = { redirectUri },
                    AllowedCorsOrigins = allowCorsOrigin,
                    
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        ApiName
                    },

                    RequireConsent = false,
                    AlwaysIncludeUserClaimsInIdToken = true
                }
            };
        }
    }
}