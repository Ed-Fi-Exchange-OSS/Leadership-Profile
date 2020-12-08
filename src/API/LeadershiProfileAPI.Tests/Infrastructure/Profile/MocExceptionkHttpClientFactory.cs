using System;
using System.Net.Http;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MocExceptionkHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name)
        {
            return new HttpClient(new MockExceptionHttpHandlerForProfiles())
            {
                BaseAddress = new Uri(@"https://api.ed-fi.org/")
            };
        }
    }
}