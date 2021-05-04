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
        public async Task ShouldGetResponseWithMinYearsRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddMinYears(0);
            
            var response = await Testing.Send(new List.Query
            {
                Page = 1, SearchRequestBody = body
            });
            
            response.ShouldNotBeNull();
        }
        
        [Fact]
        public async Task ShouldGetResponseWithMaxYearsRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddMaxYears(0);
            
            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });
            
            response.ShouldNotBeNull();
        }
        
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
        public async Task ShouldGetResponseWithCertificationsRequest()
        {
            var body = new ProfileSearchRequestBody()
                .AddCertifications();
            
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
                .AddMinYears(0)
                .AddMaxYears(10)
                .AddRatings()
                .AddCertifications()
                .AddAssignments()
                .AddDegrees();
            
            var response = await Testing.Send(new List.Query
            {
                SearchRequestBody = body
            });
            
            response.ShouldNotBeNull();
        }
    }
}
