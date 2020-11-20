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
            var mockHttpClientFactory = new MockHttpClientFactory();
            var mockLogger = new MockLogger();

            var controller = new ProfileController(mockLogger, mockHttpClientFactory);

            var result = (await controller.Get()).ToList();

            result.ShouldNotBeNull();

			result.Count.ShouldBeEquivalentTo(2);

			result.Select(x=>x.FirstName).Contains("Barry").ShouldBeTrue();
        }
    }
}
