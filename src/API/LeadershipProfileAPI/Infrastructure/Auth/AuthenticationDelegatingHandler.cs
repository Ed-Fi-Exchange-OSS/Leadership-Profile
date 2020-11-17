using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;

namespace LeadershipProfileAPI.Infrastructure.Auth
{
    public class AuthenticationDelegatingHandler : DelegatingHandler
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        public ConcurrentDictionary<string, string> TokenDictionary;

        public AuthenticationDelegatingHandler(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
            TokenDictionary = new ConcurrentDictionary<string, string>();
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            var valueFound = TokenDictionary.TryGetValue("token", out var tokenValue);
            HttpResponseMessage response = null;

            if (valueFound)
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenValue);
                response = await base.SendAsync(request, cancellationToken);
            }

            if (response != null &&
                response.StatusCode != HttpStatusCode.Unauthorized &&
                response.StatusCode != HttpStatusCode.Forbidden)
                return response;

            var newToken = await GetNewToken();
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", newToken);
            response = await base.SendAsync(request, cancellationToken);

            return response;
        }

        private async Task<string> GetNewToken()
        {
            var baseUri = new Uri(_configuration["ODS-API"] + @"/v5.0.0/api/");

            var encodedConsumerKey = HttpUtility.UrlEncode(_configuration["TeacherPortal:Client-Id"]);
            var encodedConsumerKeySecret = HttpUtility.UrlEncode(_configuration["TeacherPortal:Client-Password"]);
            var encodedPair =
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{encodedConsumerKey}:{encodedConsumerKeySecret}"));


            var requestToken = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(baseUri, "oauth/token"),
                Content = new StringContent("grant_type=client_credentials")
            };

            requestToken.Content.Headers.ContentType =
                new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded") { CharSet = "UTF-8" };
            requestToken.Headers.TryAddWithoutValidation("Authorization", $"Basic {encodedPair}");

            var authApi = _clientFactory.CreateClient();
            var authResponse = await authApi.SendAsync(requestToken);

            if (!authResponse.IsSuccessStatusCode)
                return string.Empty;

            var refreshTokenResponse = await authResponse.Content.ReadAsStreamAsync();
            var result = await JsonSerializer.DeserializeAsync<RefreshTokenResponse>(refreshTokenResponse);

            TokenDictionary.AddOrUpdate("token", result.AccessToken, (k, existingToken) => result.AccessToken); // check for key match

            return result.AccessToken;
        }
    }

    public class RefreshTokenResponse
    {
        [JsonPropertyName("access_token")] public string AccessToken { get; set; }
    }
}
