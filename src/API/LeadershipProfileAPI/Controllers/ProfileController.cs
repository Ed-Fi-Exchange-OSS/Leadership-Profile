using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using LeadershipProfileAPI.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
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
            var pageSizeLimit = 10;
            var offset = (intPage <= 0 ? 0 : intPage - 1) * pageSizeLimit;

            var query = new Dictionary<string, string>
            {
                {"offset",$"{offset}"},
                {"limit",$"{pageSizeLimit}"},
                {"totalCount",$"{true}"}
            };

            var client = _clientFactory.CreateClient(Constants.ODSApiClient);

            var staffsRequest = new HttpRequestMessage(HttpMethod.Get,
                QueryHelpers.AddQueryString($"{Constants.VersionUriFragment}/ed-fi/staffs", query));
            
            var response = await GetApiResponse<IList<Models.TeacherProfile>>(client, staffsRequest).ConfigureAwait(false);

            var staffCount = Convert.ToInt32(response.headers.GetHeader("Total-Count"));

            await GetAssociations(client, response.response).ConfigureAwait(false);

            foreach (var teacherProfile in response.response)
            {
                teacherProfile.Location = teacherProfile.Addresses.GetLocation();
                teacherProfile.FullName =
                    $"{teacherProfile.FirstName} {teacherProfile.MiddleName} {teacherProfile.LastName}";
            }

            var currentPageProfiles = response.response.AsQueryable();
            
            // if (search != null)
            //     currentPageProfiles = currentPageProfiles
            //         .Where(x => x.FirstName.ToLowerInvariant().Contains(search) || x.LastName.ToLowerInvariant().Contains(search))
            //         .AsQueryable();

            if (sortBy != null && sortField != null)
                currentPageProfiles = Sort(currentPageProfiles, sortField, sortBy).AsQueryable();

            return new DirectoryResponse
            {
                TotalCount = staffCount,
                Profiles = currentPageProfiles.ToArray(),
                Page = intPage
            };
        }

        [HttpGet(":id")]
        public async Task<Models.TeacherCompleteProfile> GetProfile([FromQuery] Guid id)
        {
            var client = _clientFactory.CreateClient(Constants.ODSApiClient);

            var query = new Dictionary<string, string>
            {
                {"id",$"{id}"}
            };

            // var staffRequest = new HttpRequestMessage(HttpMethod.Get,
            //     QueryHelpers.AddQueryString($"...", query));

            // var response = await GetApiResponse<IList<Models.TeacherCompleteProfile>>(client, staffRequest).ConfigureAwait(false);

            return new Models.TeacherCompleteProfile();
        }

        private static async Task GetAssociations(HttpClient client, IList<Models.TeacherProfile> staffTeacherProfiles)
        {
            /*Note: this approach is less than idea but we are dependent on the ODS API.
              In near future, this will optimized with access to data.
            */
            foreach (var staffTeacherProfile in staffTeacherProfiles)
            {
                var organizationQuery = new Dictionary<string, string>
                {
                    {"totalCount", $"{true}"},
                    {"staffUniqueId", $"{staffTeacherProfile.StaffUniqueId}"}
                };

                var organizationRequest = new HttpRequestMessage(HttpMethod.Get, 
                    QueryHelpers.AddQueryString($"{Constants.VersionUriFragment}/ed-fi/staffEducationOrganizationAssignmentAssociations", 
                        organizationQuery));

                var organizations = (await GetApiResponse<IList<Models.StaffOrganization>>(client, organizationRequest).ConfigureAwait(false)).response;

                staffTeacherProfile.YearsOfService = organizations.GetYearsOfService();

                var schoolQuery = new Dictionary<string, string> {{"schoolid", organizations.FirstOrDefault()?.educationOrganizationReference.educationOrganizationId.ToString()}};

                var schoolRequest = new HttpRequestMessage(HttpMethod.Get, QueryHelpers.AddQueryString($"{Constants.VersionUriFragment}/ed-fi/schools", schoolQuery));

                var schools = (await GetApiResponse<IList<Models.School>>(client, schoolRequest).ConfigureAwait(false)).response;

                staffTeacherProfile.Institution = schools.FirstOrDefault()?.nameOfInstitution;
            }
        }

        private static async Task<(HttpResponseHeaders headers, TResponse response)> GetApiResponse<TResponse>(HttpClient client, HttpRequestMessage request)
        {
            var response = await client.SendAsync(request).ConfigureAwait(false);

            var readAsString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            if (!response.IsSuccessStatusCode)
                throw new ApiExceptionFilter.ApiException(
                    $"ODS API call for uri({request.RequestUri}) failed with response: {response.StatusCode}");

            return (response.Headers, System.Text.Json.JsonSerializer.Deserialize<TResponse>(readAsString));
        }

        private static IEnumerable<Models.TeacherProfile> Sort(IQueryable<Models.TeacherProfile> teacherProfiles, string sortField, string sortOrder)
        {
            if (string.IsNullOrWhiteSpace(sortField))
            {
                return teacherProfiles;
            }

            return sortOrder == "asc"
                ? SortAscending(teacherProfiles, sortField)
                : SortDescending(teacherProfiles, sortField);
        }

        private static IQueryable<Models.TeacherProfile> SortAscending(IQueryable<Models.TeacherProfile> teacherProfiles, string sortField)
        {
            return sortField.ToLower() switch
            {
                "id" => teacherProfiles.OrderBy(x => x.Id),
                "name" => teacherProfiles.OrderBy(x => x.LastName),
                "location" => teacherProfiles.OrderBy(x => x.Location),
                "school" => teacherProfiles.OrderBy(x => x.Institution),
                // "position" => teacherProfiles.OrderBy(x => x.Position),
                "yearsOfService" => teacherProfiles.OrderBy(x => x.YearsOfService),
                "highestDegree" => teacherProfiles.OrderBy(x => x.HighestDegree),
                "major" => teacherProfiles.OrderBy(x => x.Major),
                _ => teacherProfiles
            };
        }

        private static IQueryable<Models.TeacherProfile> SortDescending(IQueryable<Models.TeacherProfile> teacherProfiles, string sortField)
        {
            return sortField.ToLower() switch
            {
                "id" => teacherProfiles.OrderByDescending(x => x.Id),
                "name" => teacherProfiles.OrderByDescending(x => x.LastName),
                "location" => teacherProfiles.OrderByDescending(x => x.Location),
                "school" => teacherProfiles.OrderByDescending(x => x.Institution),
                // "position" => teacherProfiles.OrderByDescending(x => x.Position),
                "yearsOfService" => teacherProfiles.OrderByDescending(x => x.YearsOfService),
                "highestDegree" => teacherProfiles.OrderByDescending(x => x.HighestDegree),
                "major" => teacherProfiles.OrderByDescending(x => x.Major),
                _ => teacherProfiles
            };
        }
    }

    public class DirectoryResponse
    {
        public int TotalCount { get; set; }

        public Models.TeacherProfile[] Profiles { get; set; }

        public int Page { get; set; }
    }
}