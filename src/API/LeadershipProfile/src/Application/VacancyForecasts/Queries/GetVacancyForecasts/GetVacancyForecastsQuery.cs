namespace LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyForecasts;

public record GetVacancyForecastsQuery : IRequest<IEnumerable<VacancyForecast>>;

public class GetVacancyForecastsQueryHandler : IRequestHandler<GetVacancyForecastsQuery, IEnumerable<VacancyForecast>>
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<VacancyForecast>> Handle(GetVacancyForecastsQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        var rng = new Random();

        return Enumerable.Range(1, 5).Select(index => new VacancyForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        });
    }
}
