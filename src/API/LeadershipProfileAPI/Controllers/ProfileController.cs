using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using HttpMethod = System.Net.Http.HttpMethod;

namespace LeadershipProfileAPI.Controllers
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ILogger<ProfileController> _logger;
        private readonly IHttpClientFactory _clientFactory;

        public ProfileController(ILogger<ProfileController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        [HttpGet]
        public async Task<DirectoryResponse> GetDirectory(
                [FromQuery] string page,
                [FromQuery] string sortField,
                [FromQuery] string sortBy,
                [FromQuery] string search
            )
        {
            var intPage = Convert.ToInt32(page);
            var pageSizeLimit = 20;// for some reason the API returns only half of the limit. If we need 10 record, set the limit to 20
            var offset = (intPage <= 0 ? 0 : intPage - 1) * pageSizeLimit;

            var query = new Dictionary<string, string>
            {
                {"offset",$"{offset}"},
                {"limit",$"{pageSizeLimit}"},
                {"totalCount",$"{true}"}
            };

            var client = _clientFactory.CreateClient(Constants.ODSApiClient);

            var request = new HttpRequestMessage(HttpMethod.Get, QueryHelpers.AddQueryString($"{Constants.VersionUriFragment}/ed-fi/staffs", query));
            
            var response = await client.SendAsync(request).ConfigureAwait(false);

            var readAsString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            var totalCount = Convert.ToInt32(response.Headers.FirstOrDefault(a => a.Key =="Total-Count").Value?.FirstOrDefault());
          
            var allProfiles = JsonConvert.DeserializeObject<IList<TeacherProfile>>(JArray.Parse(readAsString).ToString());

            var currentPageProfiles = allProfiles.AsQueryable();

            if (search != null)
                currentPageProfiles = currentPageProfiles
                    .Where(x => x.FirstName.ToLowerInvariant().Contains(search) || x.LastName.ToLowerInvariant().Contains(search))
                    .AsQueryable();

            if (sortBy != null && sortField != null)
                currentPageProfiles = Sort(currentPageProfiles, sortField, sortBy).AsQueryable();

            return new DirectoryResponse
            {
                TotalCount = totalCount,
                Profiles = currentPageProfiles.ToArray(),
                Page = intPage
            };
        }

        private static IEnumerable<TeacherProfile> Sort(IQueryable<TeacherProfile> teacherProfiles, string sortField, string sortOrder)
        {
            if (string.IsNullOrWhiteSpace(sortField))
            {
                return teacherProfiles;
            }

            return sortOrder == "asc"
                ? SortAscending(teacherProfiles, sortField)
                : SortDescending(teacherProfiles, sortField);
        }

        private static IQueryable<TeacherProfile> SortAscending(IQueryable<TeacherProfile> teacherProfiles, string sortField)
        {
            return sortField.ToLower() switch
            {
                "id" => teacherProfiles.OrderBy(x => x.Id),
                "name" => teacherProfiles.OrderBy(x => x.LastName),
                _ => teacherProfiles
            };
        }

        private static IQueryable<TeacherProfile> SortDescending(IQueryable<TeacherProfile> teacherProfiles, string sortField)
        {
            return sortField.ToLower() switch
            {
                "id" => teacherProfiles.OrderByDescending(x => x.Id),
                "name" => teacherProfiles.OrderByDescending(x => x.LastName),
                _ => teacherProfiles
            };
        }
    }

    public class DirectoryResponse
    {
        public int TotalCount { get; set; }

        public TeacherProfile[] Profiles { get; set; }

        public int Page { get; set; }
    }

    public class TeacherProfile
    {
        [JsonProperty("staffUniqueId")] public string Id { get; set; }
        [JsonProperty("firstName")] public string FirstName { get; set; }
        [JsonProperty("middleName")] public string MiddleName { get; set; }
        [JsonProperty("lastSurname")] public string LastName { get; set; }
    }
}