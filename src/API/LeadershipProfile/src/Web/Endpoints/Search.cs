using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.Search.Queries;
using LeadershipProfile.Application.Search.Queries.GetAllWithPagination;
using LeadershipProfile.Application.Search.Queries.GetFilteredWithPagination;
using LeadershipProfile.Domain.Entities.ProfileSearchRequest;
using NSwag.Annotations;
namespace LeadershipProfile.Web.Endpoints;

// [ApiExplorerSettings(IgnoreApi = true)]
[OpenApiIgnore]
public class Search : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetSearchResults)
            .MapPost(GetFilteredSearchResults);
    }

    public async Task<PaginatedList<SearchResultDto>> GetSearchResults(ISender sender, [AsParameters] GetAllWithPaginationQuery query)
    {
        return await sender.Send(query);
    }
    [OpenApiIgnore]
    public async Task<Response<SearchResultDto>> GetFilteredSearchResults(ISender sender,
             GetFilteredWithPaginationQuery query)
    {
        return await sender.Send(query);
    }
}
