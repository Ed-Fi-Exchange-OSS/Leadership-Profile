using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchYearsOfPriorExperienceFilterTests
    {
        [Fact]
        public async Task ShouldFilterBySingleRange()
        {
            var body = new ProfileSearchRequestBody()
                .AddYearsOfPriorExperience(new ProfileSearchYearsOfPriorExperience.Range(1, 5));

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(s => s.YearsOfService >= 1 && s.YearsOfService <= 5)
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson); //1
            resultIds.ShouldContain(TestDataConstants.StaffUsis.BarryQuinoa); //4
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.JacksonBonham); //21
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaPage); //35
        }

        [Fact]
        public async Task ShouldFilterByMultipleRanges()
        {
            var body = new ProfileSearchRequestBody()
                .AddYearsOfPriorExperience(new ProfileSearchYearsOfPriorExperience.Range(16, 20),
                    new ProfileSearchYearsOfPriorExperience.Range(25, 30));

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(s => (s.YearsOfService >= 16 && s.YearsOfService <= 20) || (s.YearsOfService >= 25 && s.YearsOfService <= 30))
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson); //16
            resultIds.ShouldContain(TestDataConstants.StaffUsis.DonaldJones); //26.5
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.JacksonBonham); //21
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaPage); //35
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa); //4
        }
    }
}
