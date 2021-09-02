using System;
using System.Linq;
using LeadershipProfileAPI.Features.Search;
using Shouldly;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class ListTests
    {

        [Fact]
        public async Task ShouldGetResponseWithEmptyRequest()
        {
            var body = new ProfileSearchRequestBody();
            var response = await SendSearchQuery(body);

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithRatingsRequest()
        {
            var body = new ProfileSearchRequestBody().AddRatings();
            var response = await SendSearchQuery(body);

            response.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetResponseWithFullRequest()
        {
            var masters = await Testing.DbContextScopeExec(db
                => db.ListItemDegrees.SingleAsync(d => d.Text == "Master's"));

            var body = new ProfileSearchRequestBody() { Name = "mar" }
                .AddInstitutions(TestDataConstants.SchoolIds.LemmElementary)
                .AddDegrees(masters.Value);

            var inclusiveResults = await SearchAllTestUtility.SearchForAllResults(body);

            inclusiveResults.All(s => s.Degree == "Master's"
                          && s.Institution == "Lemm Elementary School"
                          && s.FullName.Contains("mar", StringComparison.CurrentCultureIgnoreCase)
                ).ShouldBeTrue();

            var inclusiveResultIds = inclusiveResults.Select(r => r.StaffUniqueId).ToList();
            inclusiveResultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet);
            inclusiveResultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson);
            inclusiveResultIds.ShouldNotContain(TestDataConstants.StaffUsis.MartaMasterson);

            var principal = await Testing.DbContextScopeExec(db
                => db.ListItemAssignments.SingleAsync(d => d.Text == "Principal"));

            body.AddAssignments(principal.Value);

            var exclusiveResults = await SearchAllTestUtility.SearchForAllResults(body);
            exclusiveResults.All(s => s.Degree == "Master's"
                             && s.Institution == "Lemm Elementary School"
                             && s.Assignment == "Principal"
                             && s.FullName.Contains("mar", StringComparison.CurrentCultureIgnoreCase)
            ).ShouldBeTrue();

            var exclusiveResultIds = exclusiveResults.Select(r => r.StaffUniqueId).ToList();
            exclusiveResultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet);
            exclusiveResultIds.ShouldNotContain(TestDataConstants.StaffUsis.MartyJackson);
            exclusiveResultIds.ShouldNotContain(TestDataConstants.StaffUsis.MartaMasterson);
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
