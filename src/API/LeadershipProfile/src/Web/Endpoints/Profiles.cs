using LeadershipProfile.Application.Profiles.Queries.GetProfile;

namespace LeadershipProfile.Web.Endpoints;

public class Profiles : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet("{id}", GetProfile);
    }

    public async Task<Response> GetProfile(ISender sender, string id)
    {
        return await sender.Send(new GetProfileQuery {
            Id = id
        });
    }
}
