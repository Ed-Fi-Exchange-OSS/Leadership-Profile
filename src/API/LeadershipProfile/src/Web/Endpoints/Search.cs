using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.Search.Queries;

namespace LeadershipProfile.Web.Endpoints;

public class Search : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            // .MapGet(GetSearchResults);
            .MapPost(GetSearchResults);
    }

    public async Task<PaginatedList<SearchResultDto>> GetSearchResults(ISender sender, [AsParameters] GetAllWithPaginationQuery query)
    {
        return await sender.Send(query);
    }
}
