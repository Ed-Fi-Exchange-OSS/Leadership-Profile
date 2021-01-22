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
    }
}
