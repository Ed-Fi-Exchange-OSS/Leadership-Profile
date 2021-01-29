using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Infrastructure
{
    public class AutomapperConfigurationTests
    {
        [Fact]
        public async Task ValidateAutomapperConfig()
        {
            await Testing.ScopeExec((services) =>
            {
                var mapper = services.GetRequiredService<IMapper>();
                mapper.ConfigurationProvider.AssertConfigurationIsValid();

                return Task.CompletedTask;
            });
        }
    }
}
