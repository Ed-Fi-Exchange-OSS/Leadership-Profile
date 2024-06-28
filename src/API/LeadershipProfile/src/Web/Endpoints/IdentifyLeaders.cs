using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

namespace LeadershipProfile.Web.Endpoints;

public class IdentifyLeaders : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(GetLeadersWithPagination);
    }

    public async Task<ResponseDto> GetLeadersWithPagination(ISender sender, GetLeadersWithPaginationQuery query)
    {
        return await sender.Send(query);
    }
}
