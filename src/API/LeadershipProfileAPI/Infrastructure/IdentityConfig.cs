using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;

namespace LeadershipProfileAPI.Infrastructure
{
    public class IdentityConfig
    {
        public static string ApiName = "TPDM_API";

        public static List<TestUser> Users
        {
            get
            {
                var address = new
                {
                    street_address = "Morado Circle",
                    locality = "Austin, TX",
                    postal_code = 78759,
                    country = "USA"
                };

                return new List<TestUser>
                {
                    new TestUser
                    {
                        SubjectId = "818727",
                        Username = "alice",
                        Password = "alice",
                        Claims =
                        {
                            new Claim(JwtClaimTypes.Name, "Alice Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Alice"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.Email, "AliceSmith@email.com"),
                            new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                            new Claim(JwtClaimTypes.Role, "admin"),
                            new Claim(JwtClaimTypes.WebSite, "http://alice.com"),
                            new Claim(JwtClaimTypes.Address, JsonSerializer.Serialize(address),
                                IdentityServerConstants.ClaimValueTypes.Json)
                        }
                    },
                    new TestUser
                    {
                        SubjectId = "88421113",
                        Username = "bob",
                        Password = "bob",
                        Claims =
                        {
                            new Claim(JwtClaimTypes.Name, "Bob Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Bob"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.Email, "BobSmith@email.com"),
                            new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                            new Claim(JwtClaimTypes.Role, "user"),
                            new Claim(JwtClaimTypes.WebSite, "http://bob.com"),
                            new Claim(JwtClaimTypes.Address, JsonSerializer.Serialize(address),
                                IdentityServerConstants.ClaimValueTypes.Json)
                        }
                    }
                };
            }
        }

        public static IEnumerable<IdentityResource> IdentityResources =>
            new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
               new IdentityResource("roles", " user roles", new List<string>(){"role"})

            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new List<ApiScope>
            {
                new ApiScope(ApiName, ApiName)
            };

        public static IEnumerable<Client> Clients =>
            new List<Client>
            {
                // machine to machine client
                new Client
                {
                    ClientId = "client",
                    ClientSecrets = { new Secret("secret".Sha256()) },

                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    // scopes that client has access to
                    AllowedScopes = {ApiName},

                    RequireConsent = false

                },
                new Client
                {
                    ClientId = "interactive",
                    ClientSecrets = { new Secret("secret".Sha256()) },
                    ClientName = "code Client",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false,

                    RedirectUris =           { "https://localhost:5001/login" }, //should be our home page
                    //PostLogoutRedirectUris = { "https://localhost:5001/login" },
                    AllowedCorsOrigins =     { "https://localhost:5001" },

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