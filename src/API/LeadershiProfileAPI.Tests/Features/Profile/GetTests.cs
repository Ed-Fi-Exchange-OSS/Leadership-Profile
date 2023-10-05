// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

using System;
using System.Linq;
using LeadershipProfileAPI.Features.Profile;
using Shouldly;
using System.Threading.Tasks;
using LeadershipProfileAPI.Tests.Features.Search;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Profile
{
    public class GetTests
    {
        [Fact]
        public async Task ShouldGetProfile()
        {
            var profile = await Testing.Send(new Get.Query {Id = TestDataConstants.StaffUsis.BarryQuinoa });

            profile.ShouldNotBeNull();
            profile.FirstName.ShouldBe("Barry");
            profile.LastName.ShouldBe("Quinoa");
            profile.MiddleName.ShouldBeNullOrEmpty();
            profile.Phone.ShouldBe("512-456-3222");
            profile.Email.ShouldBe("barry.quinoa@example.com");
        }

        [Fact]
        public async Task ShouldGetPositionHistory()
        {
            var profile = await Testing.Send(new Get.Query { Id = TestDataConstants.StaffUsis.BarryQuinoa });

            profile.ShouldNotBeNull();
            profile.PositionHistory.Count().ShouldBe(3);

            var latestPosition = profile.PositionHistory.First();

            latestPosition.Role.ShouldBe("Principal");
            latestPosition.SchoolName.ShouldBe("Charleston Intermediate School");
            latestPosition.StartDate.ShouldNotBe(DateTime.MinValue);
            latestPosition.EndDate.ShouldNotBeNull();

            var lastPosition = profile.PositionHistory.Last();
            lastPosition.Role.ShouldBe("Assistant Principal");
            lastPosition.SchoolName.ShouldBe("Carter Collins High School");
            lastPosition.StartDate.ShouldNotBe(DateTime.MinValue);
            lastPosition.EndDate.ShouldNotBeNull();
        }

        [Fact]
        public async Task ShouldGetCertificates()
        {
            var profile = await Testing.Send(new Get.Query { Id = TestDataConstants.StaffUsis.BarryQuinoa });

            profile.ShouldNotBeNull();
            profile.Certificates.ShouldNotBeEmpty();

            profile.Certificates.Count().ShouldBe(2);

            var health = profile.Certificates.First(c => c.Description == "Health");
            health.Type.ShouldBe("Certification");
            health.ValidFromDate.ShouldNotBe(DateTime.MinValue);

            var otherCert = profile.Certificates.First(c => c.Description != "Health");
            otherCert.Type.ShouldBe("Certification");
            otherCert.Description.ShouldBe("Social Studies");
            otherCert.ValidFromDate.ShouldNotBe(DateTime.MinValue);
        }
    }
}
