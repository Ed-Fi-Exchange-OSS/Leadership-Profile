using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfileCertificationTests
    {
        [Fact]
        public async Task ShouldGetCertifications()
        {
            var certification = await Testing.DbContextScopeExec(ctx =>
                ctx.ProfileCertification.FirstOrDefaultAsync(x => x.StaffUniqueId == "1000001322"));

            certification.ShouldNotBeNull();
            certification.CredentialType.ShouldBe("Certification");
            certification.Description.ShouldBe("Mathematics");
            certification.IssuanceDate.ShouldBe(DateTime.Parse("2018-01-19"));
            certification.ExpirationDate.ShouldBe(DateTime.Parse("2024-01-31"));
        }
    }
}
