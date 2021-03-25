using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Tests.Infrastructure.Profile
{
    public class MockHttpHandlerForProfiles : HttpMessageHandler
    {
        public IDictionary<string, string> JsonStore { get; set; } = new Dictionary<string, string>();

        public MockHttpHandlerForProfiles()
        {
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var json = JsonStore.First(k => request.RequestUri.AbsolutePath.Contains(k.Key)).Value;

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = content };

            return Task.FromResult(response);
        }
    }
}