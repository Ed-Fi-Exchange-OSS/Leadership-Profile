using LeadershipProfile.Application.Common.Interfaces;

namespace LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyForecasts;

public record GetVacancyForecastsQuery : IRequest<IEnumerable<VacancyForecast>> 
{
    public string? Role { get; set; }
}

public class GetVacancyForecastsQueryHandler : IRequestHandler<GetVacancyForecastsQuery, IEnumerable<VacancyForecast>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetVacancyForecastsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<VacancyForecast>> Handle(GetVacancyForecastsQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        var nameMapping = new Dictionary<string, string>
            {
                {"Principal","Principal" },
                {"AP", "Assistant Principal"}
            };
        return await _context.StaffVacancies
            .Where(x => x.PositionTitle == nameMapping[request.Role ?? ""])
            // .OrderBy(x => x.Title)
            // .ProjectTo<TodoItemBriefDto>(_mapper.ConfigurationProvider)
            // .PaginatedListAsync(request.PageNumber, request.PageSize);
            // .PaginatedListAsync(1, 20);
            .Select(x => new VacancyForecast {
                    StaffUniqueId = x.StaffUniqueId,
                    FullName = x.FullName, 
                    Age = x.Age,
                    NameOfInstitution = x.NameOfInstitution,
                    SchoolLevel = x.SchoolLevel,
                    Gender = x.Gender,
                    Race = x.Race,
                    VacancyCause = x.VacancyCause,
                    SchoolYear = x.SchoolYear,
                    PositionTitle = x.PositionTitle,
                    OverallScore = x.OverallScore
            })
            // .Take(20)
            .ToListAsync();
    }
}
