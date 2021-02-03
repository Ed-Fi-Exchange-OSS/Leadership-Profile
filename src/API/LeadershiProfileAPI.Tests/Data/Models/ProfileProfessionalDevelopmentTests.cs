using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfileProfessionalDevelopmentTests
    {
        [Fact]
        public async Task ShouldGetProfessionalDevelopment()
        {
            await Testing.DbContextScopeExec(ctx => ctx.ProfileProfessionalDevelopment.AnyAsync());
        }
    }
}
