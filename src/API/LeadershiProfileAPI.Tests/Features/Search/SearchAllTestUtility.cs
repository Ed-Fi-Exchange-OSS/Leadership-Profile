using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Features.Search;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features.Search
{
    public class SearchAllTestUtility
    {
        public static async Task<List<List.SearchResult>> SearchForAllResults(ProfileSearchRequestBody body)
        {
            var results = await Testing.ScopeExec(async sp =>
            {
                var query = sp.GetRequiredService<EdFiDbQueryData>();
                var mapperConfig = sp.GetRequiredService<IMapper>().ConfigurationProvider;
                var searches = await query.GetSearchResultsAsync(body, pageSize: int.MaxValue);
                return searches.AsQueryable().ProjectTo<List.SearchResult>(mapperConfig).ToList();
            });

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
