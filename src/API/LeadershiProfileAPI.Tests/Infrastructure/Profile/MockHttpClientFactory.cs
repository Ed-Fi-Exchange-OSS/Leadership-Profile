using System;
using System.Net.Http;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MockHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name)
        {
            return new HttpClient(new MockHttpHandlerForProfiles())
            {
                BaseAddress = new Uri(@"https://api.ed-fi.org/")
            };
        }
    }
}