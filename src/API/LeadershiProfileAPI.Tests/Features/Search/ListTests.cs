// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using LeadershipProfileAPI.Features.Search;
using Shouldly;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
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

        [Fact]
        public async Task ShouldNotContainDuplicateResults()
        {
            var body = new ProfileSearchRequestBody();

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results.ShouldNotBeNull();

            var countsById = results
                .GroupBy(x => x.StaffUniqueId)
                .Select(x => x.Count());

            countsById.ShouldAllBe(x => x == 1);
        }

        [Fact]
        public async Task ShouldContainAccurateDirectoryInfo()
        {
            var body = new ProfileSearchRequestBody { Name = "Barry Quinoa" };

            var results = await SendSearchQuery(body);

            results.ShouldNotBeNull();
            var result = results.Results.Single();

            result.StaffUniqueId.ShouldBe(TestDataConstants.StaffUsis.BarryQuinoa);
            result.FirstName.ShouldBe("Barry");
            result.LastSurName.ShouldBe("Quinoa");
            result.FullName.ShouldBe("Barry Quinoa");
            result.Assignment.ShouldBe("Principal");
            result.Institution.ShouldBe("Charleston Intermediate School");
            result.Degree.ShouldBe("Bachelor's");
            result.YearsOfService.ShouldBe(4);
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
