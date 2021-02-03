using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfileHeaderTests
    {
        [Fact]
        public async Task ShouldGetProfileHeader()
        {
            var result = await Testing.DbContextScopeExec(ctx =>
                ctx.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == "1000003312"));

            result.FirstName.ShouldBe("Nicola");
            result.LastSurname.ShouldBe("Supple");
            result.MiddleName.ShouldBe("Edward");
            result.Telephone.ShouldBe("713-100-3312");
            result.Email.ShouldBe("Nicola.Supple.1000003312@univ.edu");
        }
    }
}
