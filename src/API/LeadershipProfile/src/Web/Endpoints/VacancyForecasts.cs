using LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyForecasts;

namespace LeadershipProfile.Web.Endpoints;

public class VacancyForecasts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            // .MapGet(GetVacancyForecasts)
            .MapGet(GetVacancyForecasts);
    }

    public async Task<IEnumerable<VacancyForecast>> GetVacancyForecasts(ISender sender)
    {
        return await sender.Send(new GetVacancyForecastsQuery());
    }
}
