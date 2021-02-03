using System;
using System.Linq;
using LeadershipProfileAPI.Features.Profile;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Profile
{
    public class GetTests
    {
        [Fact]
        public async Task ShouldGetProfile()
        {
            var profile = await Testing.Send(new Get.Query {Id = "1000003312"});

            profile.ShouldNotBeNull();
            profile.FirstName.ShouldBe("Nicola");
            profile.LastName.ShouldBe("Supple");
            profile.MiddleName.ShouldBe("Edward");
            profile.Phone.ShouldBe("713-100-3312");
            profile.Email.ShouldBe("Nicola.Supple.1000003312@univ.edu");
        }

        [Fact]
        public async Task ShouldGetPositionHistory()
        {
            var profile = await Testing.Send(new Get.Query { Id = "1000005688" });

            profile.ShouldNotBeNull();
            profile.PositionHistory.ShouldNotBeEmpty();

            var positionHistory = profile.PositionHistory.First();

            positionHistory.Role.ShouldBe("Assistant Principal");
            positionHistory.SchoolName.ShouldBe("CARLENS");
            positionHistory.StartDate.ShouldBe(DateTime.Parse("2018-01-15"));
            positionHistory.EndDate.ShouldBeNull();
        }

        [Fact]
        public async Task ShouldGetCertificates()
        {
            var profile = await Testing.Send(new Get.Query { Id = "1000001322" });

            profile.ShouldNotBeNull();
            profile.Certificates.ShouldNotBeEmpty();

            var certificate = profile.Certificates.First();
            certificate.Type.ShouldBe("Certification");
            certificate.Description.ShouldBe("Mathematics");
            certificate.ValidFromDate.ShouldBe(DateTime.Parse("2018-01-19"));
            certificate.ValidToDate.ShouldBe(DateTime.Parse("2024-01-31"));
        }
    }
}
