using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.Extensions.Configuration;

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
                response = await base.SendAsync(request, cancellationToken).ConfigureAwait(false);
            }

            if (response != null &&
                response.StatusCode != HttpStatusCode.Unauthorized &&
                response.StatusCode != HttpStatusCode.Forbidden)
                return response;

            var newToken = await GetNewTokenAsync().ConfigureAwait(false);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", newToken);
            response = await base.SendAsync(request, cancellationToken).ConfigureAwait(false);

            return response;
        }

        private async Task<string> GetNewTokenAsync()
        {
            var encodedConsumerKey = HttpUtility.UrlEncode(_configuration["ODS-API:Client-Id"]);
            var encodedConsumerKeySecret = HttpUtility.UrlEncode(_configuration["ODS-API:Client-Secret"]);
            var encodedPair =
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{encodedConsumerKey}:{encodedConsumerKeySecret}"));


            var requestToken = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"{_configuration["ODS-API"]}v5.0.0/api/oauth/token"),
                Content = new StringContent("grant_type=client_credentials")
            };

            requestToken.Content.Headers.ContentType =
                new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded") {CharSet = "UTF-8"};
            requestToken.Headers.TryAddWithoutValidation("Authorization", $"Basic {encodedPair}");

            var authApi = _clientFactory.CreateClient();
            var authResponse = await authApi.SendAsync(requestToken).ConfigureAwait(false);

            if (!authResponse.IsSuccessStatusCode)
                throw new ApiExceptionFilter.ApiException($"Authorization failed with status code: {authResponse.StatusCode}");

            var refreshTokenResponse = await authResponse.Content.ReadAsStreamAsync().ConfigureAwait(false);
            var result = await JsonSerializer.DeserializeAsync<RefreshTokenResponse>(refreshTokenResponse)
                .ConfigureAwait(false);

            TokenDictionary.AddOrUpdate("token", result.AccessToken,
                (k, existingToken) => result.AccessToken); // check for key match

            return result.AccessToken;
        }
    }

    public class RefreshTokenResponse
    {
        [JsonPropertyName("access_token")] public string AccessToken { get; set; }
    }
}
