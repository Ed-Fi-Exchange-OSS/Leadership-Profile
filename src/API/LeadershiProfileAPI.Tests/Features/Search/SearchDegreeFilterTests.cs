using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchDegreeFilterTests
    {
        [Fact]
        public async Task ShouldFilterBySingleDegree()
        {
            var bachelors = await GetDegreeValue("Bachelor's");

            var body = new ProfileSearchRequestBody()
                .AddDegrees(bachelors);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.Degree == "Bachelor's")
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.JacksonBonham);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.MaryMuffet); //Masters
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaPage); //Doctorate
        }

        [Fact]
        public async Task ShouldFilterToIncludeMultipleDegrees()
        {
            var bachelors = await GetDegreeValue("Bachelor's");
            var masters = await GetDegreeValue("Master's");

            var body = new ProfileSearchRequestBody()
                .AddDegrees(bachelors, masters);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.Degree == "Bachelor's" || r.Degree == "Master's")
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson); //Bachelors
            resultIds.ShouldContain(TestDataConstants.StaffUsis.JacksonBonham); //Bachelors
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson); //Masters
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet); //Masters
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaPage); //Doctorate
        }

        private async Task<int> GetDegreeValue(string degreeName)
        {
            var matchedDegree = await Testing.DbContextScopeExec(db
                => db.ListItemDegrees.SingleAsync(d => d.Text == degreeName));
            return matchedDegree.Value;
        }
    }
}
