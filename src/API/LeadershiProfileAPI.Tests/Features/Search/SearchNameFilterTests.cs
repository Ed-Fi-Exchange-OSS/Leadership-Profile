// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchNameFilterTests
    {
        [Fact]
        public async Task ShouldFilterByFirstName()
        {
            var body = new ProfileSearchRequestBody { Name = "Bart", };

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.FullName.Contains("bart", StringComparison.CurrentCultureIgnoreCase))
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaldJones);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa);
        }

        [Fact]
        public async Task ShouldFilterByLastName()
        {
            var body = new ProfileSearchRequestBody { Name = "Jones", };

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.FullName.Contains("Jones", StringComparison.CurrentCultureIgnoreCase))
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.DonaldJones);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa);
        }

        [Fact]
        public async Task ShouldFilterByPartialNamesAcrossFields()
        {
            var body = new ProfileSearchRequestBody { Name = "jack", };

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.FullName.Contains("jack", StringComparison.CurrentCultureIgnoreCase))
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).ToList();

            resultIds.ShouldContain(TestDataConstants.StaffUsis.BartJackson);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.MartyJackson);
            resultIds.ShouldContain(TestDataConstants.StaffUsis.JacksonBonham);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.DonaldJones);
            resultIds.ShouldNotContain(TestDataConstants.StaffUsis.BarryQuinoa);
        }

        [Fact]
        public async Task ShouldFilterByWholeName()
        {
            var body = new ProfileSearchRequestBody { Name = "Barry Quinoa", };

            var results = await SearchAllTestUtility.SearchForAllResults(body);

            results
                .All(r => r.FullName.Contains("Barry Quinoa", StringComparison.CurrentCultureIgnoreCase))
                .ShouldBeTrue();

            var resultIds = results.Select(r => r.StaffUniqueId).Single();

            resultIds.ShouldBe(TestDataConstants.StaffUsis.BarryQuinoa);
        }
    }
}
