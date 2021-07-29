using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfileListTests
    {
        [Fact]
        public async Task ShouldGetProfileList()
        {
            var result = await Testing.DbContextScopeExec((ctx) => ctx.ProfileList.FirstOrDefaultAsync(x => x.StaffUsi == 1));
            result.ShouldNotBeNull();
            result.Email.ShouldBe("Patricia.Ramirez.0132398@univ.edu");
            result.FirstName.ShouldBe("Patricia");
            result.LastSurName.ShouldBe("Ramirez");
            result.MiddleName.ShouldBeNull();
            result.StaffUniqueId.ShouldBe("0132398");
        }
    }
}
