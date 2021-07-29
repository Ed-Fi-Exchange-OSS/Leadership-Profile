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
            profile.MiddleName.ShouldBeNull();
            profile.StaffUniqueId.ShouldBe("0132398");
            profile.Institution.ShouldBe("Austin");
        }

        [Fact]
        public async Task ShouldGetProfileSortedByIdAsc()
        {
            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "id",
                SortBy = "asc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.StaffUniqueId.ShouldBe("0132398");
        }

        [Fact]
        public async Task ShouldGetProfileSortedByNameAsc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "name",
                SortBy = "asc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.LastSurName.ShouldBe("Abarough");
            profile.FirstName.ShouldBe("Evvy");
        }

        [Fact]
        public async Task ShouldGetProfileSortedBySchoolAsc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "school",
                SortBy = "asc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.Institution.ShouldBe("Arlington");
        }

        [Fact]
        public async Task ShouldGetProfileSortedByYearsOfServiceAsc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "yearsOfService",
                SortBy = "asc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.YearsOfService.ShouldBe(0);
        }

        [Fact]
        public async Task ShouldGetProfileSortedByHighestDegreeAsc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "highestDegree",
                SortBy = "asc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.HighestDegree.ShouldBeNull();
        }

        [Fact]
        public async Task ShouldGetProfileSortedByIdDesc()
        {
            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "id",
                SortBy = "desc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.StaffUniqueId.ShouldBe("z.montemayor-banda@lajoyaisd.net");
        }

        [Fact]
        public async Task ShouldGetProfileSortedByNameDesc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "name",
                SortBy = "desc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.LastSurName.ShouldBe("Zuniga");
            profile.FirstName.ShouldBe("Christian");
        }
        
        [Fact]
        public async Task ShouldGetProfileSortedBySchoolDesc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "school",
                SortBy = "desc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.Institution.ShouldBe("VLASIN");
        }

        [Fact]
        public async Task ShouldGetProfileSortedByYearsOfServiceDesc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "yearsOfService",
                SortBy = "desc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.YearsOfService.ShouldBe(0);
        }

        [Fact]
        public async Task ShouldGetProfileSortedByHighestDegreeDesc()
        {

            var response = await Testing.Send(new List.Query
            {
                Page = 1,
                SortField = "highestDegree",
                SortBy = "desc"
            });

            var profile = response.Profiles.FirstOrDefault();

            profile.ShouldNotBeNull();
            profile.HighestDegree.ShouldBeNull();
        }
    }
}
