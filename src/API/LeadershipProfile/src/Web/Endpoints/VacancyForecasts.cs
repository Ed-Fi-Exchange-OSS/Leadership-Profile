using LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyForecasts;

namespace LeadershipProfile.Web.Endpoints;

public class VacancyForecasts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            // .MapGet(GetVacancyForecasts)
            .MapPost(GetVacancyForecasts);
            // .MapPost(GetVacancyCausesBySchool, "GetVacancyCausesBySchool");
    }

    public async Task<IEnumerable<VacancyForecast>> GetVacancyForecasts(ISender sender, GetVacancyForecastsQuery query)
    {
        return await sender.Send(query);
    }
    // public async Task<IEnumerable<VacancyForecast>> GetVacancyCausesBySchool(ISender sender, GetVacancyCausesBySchoolQuery query)
    // {
    //     return await sender.Send(query);
    // }
}
