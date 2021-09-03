using LeadershipProfileAPI.Features.Search;
using Shouldly;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class ListTests
    {

        [Fact]
        public async Task ShouldGetResponseWithRatingsRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddRatings();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithAssignmentsRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddAssignments();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithDegreesRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddDegrees();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithFullRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddRatings()
                .AddAssignments()
                .AddDegrees();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithEmptyRequest()
        {
            var body = new ProfileSearchRequestBody();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithInstitutionRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddInstitutions();

            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });

            response.ShouldNotBeNull();
        }
    }
}
