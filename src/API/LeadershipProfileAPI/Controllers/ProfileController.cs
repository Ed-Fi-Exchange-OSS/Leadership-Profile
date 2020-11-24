using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
                [FromQuery] int page,
                [FromQuery] string sortField,
                [FromQuery] string sortBy,
                [FromQuery] string search
            )
        {
            var client = _clientFactory.CreateClient(Constants.ODSApiClient);

            var request = new HttpRequestMessage(HttpMethod.Get, $"{Constants.VersionUriFragment}/ed-fi/staffs");

            var response = await client.SendAsync(request).ConfigureAwait(false);

            response.EnsureSuccessStatusCode();

            var readAsString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            var allProfiles = JsonConvert.DeserializeObject<IList<TeacherProfile>>(JArray.Parse(readAsString).ToString());

            var currentPageProfiles = allProfiles.AsQueryable();

            if (search != null)
                currentPageProfiles = currentPageProfiles
                    .Where(x => x.FirstName.Contains(search) || x.LastName.Contains(search))
                    .AsQueryable();

            if (sortBy != null && sortField != null)
                currentPageProfiles = Sort(currentPageProfiles, sortField, sortBy).AsQueryable();

            currentPageProfiles = currentPageProfiles.Skip((page <= 0 ? 0 : page - 1) * 10).Take(10).AsQueryable();

            return new DirectoryResponse
            {
                TotalCount = allProfiles.Count,
                Profiles = currentPageProfiles.ToList(),
                Page = page
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

        public List<TeacherProfile> Profiles { get; set; }

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