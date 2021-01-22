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

            profile.FirstName.ShouldBe("Patricia");
            profile.LastSurName.ShouldBe("Ramirez");
            profile.MiddleName.ShouldBe(null);
            profile.StaffUniqueId.ShouldBe("0132398");
            profile.Location.ShouldBe("Dallas");
        }
    }
}
