using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Features.Search;
using LeadershipProfileAPI.Tests.Extensions;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchSchoolFilterTests
    {
        [Fact]
        public async Task ShouldFilterBySingleSchool()
        {
            var body = new ProfileSearchRequestBody()
                .AddInstitutions(TestDataConstants.SchoolIds.LemmElementary);

            var response = await SendSearchQuery(body);

            response.Results
                .All(r => r.Institution == "Lemm Elementary School")
                .ShouldBeTrue();

            var resultIds = response.Results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaPage); //Not at Lemm
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.JacksonBonham); //Not at Lemm
        }

        [Fact]
        public async Task ShouldFilterByMultipleSchools()
        {
            var body = new ProfileSearchRequestBody()
                .AddInstitutions(TestDataConstants.SchoolIds.LemmElementary, TestDataConstants.SchoolIds.CarterCollins);

            var response = await SendSearchQuery(body);

            response.Results.All(r => r.Institution == "Lemm Elementary School" || r.Institution == "Carter Collins High School").ShouldBeTrue();

            var resultIds = response.Results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.DonaldJones);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.JacksonBonham);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa); //Previously @ Carter Collins
        }

        [Fact]
        public async Task ShouldExcludePreviousAssociations()
        {
            var schoolWithNoCurrentAssignments = TestDataConstants.SchoolIds.MountainOak;

            var body = new ProfileSearchRequestBody().AddInstitutions(schoolWithNoCurrentAssignments);
            var response = await SendSearchQuery(body);

            response.Results.ShouldBeEmpty();
        }

        [Fact]
        public async Task ShouldReturnFilteredResultTotal()
        {
            var body = new ProfileSearchRequestBody()
                .AddInstitutions(TestDataConstants.SchoolIds.LemmElementary);

            var result = await SearchAllTestUtility.SearchForPage(body);
            var totalFilteredCount = (await SearchAllTestUtility.SearchForAllResults(body)).Count;

            result.TotalCount.ShouldBe(totalFilteredCount);
        }

        private Task<List.Response> SendSearchQuery(ProfileSearchRequestBody body, int page = 1)
        {
            return Testing.Send(new List.Query
            {
                SearchRequestBody = body,
                Page = page,
            });
        }
    }
}
