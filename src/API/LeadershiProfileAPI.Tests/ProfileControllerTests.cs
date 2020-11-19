using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Controllers;
using LeadershipProfileAPI.Tests.Infrastructure;
using LeadershipProfileAPI.Tests.Infrastructure.Profile;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests
{
    public class ProfileControllerTests
    {
        [Fact]
        public async Task ShouldReturnListOfTeacherProfiles()
        {
            var fakeClientFactory = new MockHttpClientFactory();
            var  fakeLogger = new MockLogger();

            var controller = new ProfileController(fakeLogger, fakeClientFactory);

            var result = (await controller.Get()).ToList();

            result.ShouldNotBeNull();

			result.Count.ShouldBeEquivalentTo(2);

			result.Select(x=>x.FirstName).Contains("Barry").ShouldBeTrue();
        }
    }
}
