using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchAssignmentFilterTests
    {
        [Fact]
        public async Task ShouldFilterBySingleAssignment()
        {
            var teacher = await GetAssignmentValue("Teacher");

            var body = new ProfileSearchRequestBody().AddAssignments(teacher);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.Assignment == "Teacher")
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.Distinct().Count().ShouldBe(resultIds.Count);

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson); //Current Teacher
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartaMasterson); //Current Teacher
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.JacksonBonham); //Never Teacher
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.MaryMuffet); //Formerly Teacher
        }

        [Fact]
        public async Task ShouldFilterToIncludeMultipleAssignments()
        {
            var principal = await GetAssignmentValue("Principal");
            var assistantPrincipal = await GetAssignmentValue("Assistant Principal");

            var body = new ProfileSearchRequestBody()
                    .AddAssignments(assistantPrincipal, principal);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.Assignment == "Principal" || r.Assignment == "Assistant Principal")
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet); //Principal
            resultIds.ShouldContain(TestDataConstants.StaffUsis.DonaPage); //Assistant Principal
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BartJackson); //Teacher Only
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.MartaMasterson); //Teacher Only
        }

        [Fact]
        public async Task ShouldReturnFilteredResultTotal()
        {
            var teacher = await GetAssignmentValue("Teacher");

            var body = new ProfileSearchRequestBody().AddAssignments(teacher);

            var result = await SearchAllTestUtility.SearchForPage(body);
            var totalFilteredCount = (await SearchAllTestUtility.SearchForAllResults(body)).Count;

            result.TotalCount.ShouldBe(totalFilteredCount);
        }

        private async Task<int> GetAssignmentValue(string assignmentName)
        {
            var matchedAssignment = await Testing.DbContextScopeExec(db
                => db.ListItemAssignments.SingleAsync(d => d.Text == assignmentName));
            return matchedAssignment.Value;
        }
    }
}
