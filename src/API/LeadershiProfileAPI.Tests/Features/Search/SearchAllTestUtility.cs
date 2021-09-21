using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Features.Search;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchAllTestUtility
    {
        public static async Task<List<List.SearchResult>> SearchForAllResults(ProfileSearchRequestBody body)
        {
            var page = 1;
            var firstResponse = await SendSearch(body, page);
            var totalPages = firstResponse.PageCount;
            var results = firstResponse.Results.ToList();

            while (page < totalPages)
            {
                page++;
                var response = await SendSearch(body, page);
                results.AddRange(response.Results);
            }

            return results;
        }

        public static Task<List.Response> SearchForPage(ProfileSearchRequestBody body, int page = 1)
        {
            return SendSearch(body, page);
        }

        [Fact]
        public async Task ShouldGetAllResults()
        {
            var body = new ProfileSearchRequestBody();
            var totalCount = (await SendSearch(body, 1)).TotalCount;

            var result = await SearchForAllResults(body);

            result.Count.ShouldBe(totalCount);
        }

        private static Task<List.Response> SendSearch(ProfileSearchRequestBody body, int page)
        {
            return Testing.Send(new List.Query
            {
                SearchRequestBody = body,
                SortField = "name",
                SortBy = "asc",
                Page = page,
            });
        }
    }
}
