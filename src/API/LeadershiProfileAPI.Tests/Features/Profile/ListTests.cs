using LeadershipProfileAPI.Features.Profile;
using Shouldly;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Profile
{
    public class ListTests
    {
        [Fact]
        public async Task ShouldGetProfiles()
        {
            var response = await Testing.Send(new List.Query
            {
                Page = 1
            });

            response.Profiles.Count.ShouldBe(10);

            var profile = response.Profiles.FirstOrDefault();

            profile.FirstName.ShouldBe("Evvy");
            profile.LastSurName.ShouldBe("Abarough");
            profile.MiddleName.ShouldBe("Sofia");
            profile.StaffUniqueId.ShouldBe("1000003995");
            profile.Location.ShouldBe(null);
        }
    }
}
