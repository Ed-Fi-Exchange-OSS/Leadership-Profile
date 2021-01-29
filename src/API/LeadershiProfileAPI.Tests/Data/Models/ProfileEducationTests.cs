using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfileEducationTests
    {
        [Fact]
        public async Task ShouldGetEducation()
        {
            await Testing.DbContextScopeExec(ctx => ctx.ProfileEducation.AnyAsync());
        }
    }
}
