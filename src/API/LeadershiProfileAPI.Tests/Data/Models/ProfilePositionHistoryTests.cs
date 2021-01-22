using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Data.Models
{
    public class ProfilePositionHistoryTests
    {
        [Fact]
        public async Task ShouldGetPositionHistory()
        {
            var positionHistory = await Testing.DbContextScopeExec(ctx =>
                ctx.ProfilePositionHistory.FirstOrDefaultAsync(x => x.StaffUniqueId == "1000005688"));

            positionHistory.ShouldNotBeNull();
            positionHistory.StaffUsi.ShouldBe(2708);
            positionHistory.Role.ShouldBe("Assistant Principal");
            positionHistory.School.ShouldBe("CARLENS");
            positionHistory.StartDate.ShouldBe(DateTime.Parse("2018-01-15"));

        }
    }
}
