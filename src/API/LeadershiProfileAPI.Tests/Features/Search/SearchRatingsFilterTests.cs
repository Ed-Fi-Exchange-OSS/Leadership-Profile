// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Tests.Extensions;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchRatingsFilterTests
    {
        [Fact]
        public async Task DataSmokeTest()
        {
            var category = await Testing.DbContextScopeExec(db
                => db.ListItemCategories.SingleOrDefaultAsync(d => d.Category == "ADDRESS MISCONCEPTIONS"));

            category.ShouldNotBeNull("Test data has changed. This test fixture needs to be updated.");
        }

        [Fact]
        public async Task ShouldFilterByCategoryAndAnyScoreMagicValue()
        {
            var body = new ProfileSearchRequestBody()
                .AddRatings("ADDRESS MISCONCEPTIONS", -1);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain("207242");  //4.100
            resultIds.ShouldContain("207267");  //4.300
            resultIds.ShouldContain("207264"); //3.650
            resultIds.ShouldContain("207256"); //2.550
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.MaryMuffet); //These users have no evals
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa); //These users have no evals
        }

        [Fact]
        public async Task ShouldFilterByCategoryAndScore()
        {
            var body = new ProfileSearchRequestBody()
                .AddRatings("ADDRESS MISCONCEPTIONS", 4);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain("207242");  //4.100
            resultIds.ShouldContain("207267");  //4.300
            resultIds.ShouldNotContain("207264"); //3.650
            resultIds.ShouldNotContain("207256"); //2.550
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.MaryMuffet); //These users have no evals
        }

        [Fact]
        public async Task ShouldNotFilterWhenScoreNotSet()
        {
            var body = new ProfileSearchRequestBody()
                .AddRatings("ADDRESS MISCONCEPTIONS", 0);

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain("207242");  //4.100
            resultIds.ShouldContain("207256"); //2.550
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MaryMuffet); //These users have no evals
            resultIds.ShouldContain(TestDataConstants.StaffUsis.BarryQuinoa); //These users have no evals
        }
    }
}
