using System.Linq;
using System.Net;
using System.Threading.Tasks;
using LeadershipProfileAPI.Controllers;
using LeadershipProfileAPI.Infrastructure;
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

            var result = (await controller.GetDirectory("1",null,null,null)).Profiles.ToList();

            result.ShouldNotBeNull();

			result.Count().ShouldBeEquivalentTo(2);

			result.Select(x=>x.FirstName).Contains("Barry").ShouldBeTrue();
        }

        [Fact]
        public async Task ShouldReturnApiExceptionOnODSAPIError()
        {
            var mockHttpClientFactory = new MocExceptionkHttpClientFactory();
            var mockLogger = new MockLogger();

            var controller = new ProfileController(mockLogger, mockHttpClientFactory);

            var exception = await Should.ThrowAsync<ApiExceptionFilter.ApiException>(() => controller.GetDirectory("1", null, null, null));
            
            exception.Message.ShouldContain(HttpStatusCode.InternalServerError.ToString());
        }
    }
}
