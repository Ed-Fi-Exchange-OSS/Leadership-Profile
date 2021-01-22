using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using HttpMethod = System.Net.Http.HttpMethod;

namespace LeadershipProfileAPI.Features.Profile
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ILogger<ProfileController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IMediator _mediator;

        public ProfileController(ILogger<ProfileController> logger, IHttpClientFactory clientFactory, IMediator mediator)
        {
            _logger = logger;
            _clientFactory = clientFactory;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult> GetDirectory(
                [FromQuery] List.Query query
            )
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<Models.TeacherCompleteProfile> GetProfile([FromRoute] Guid id)
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