using LeadershipProfile.Application.Common.Interfaces;

namespace LeadershipProfile.Application.VacancyForecasts.Queries.GetActiveStaff;

public record GetActiveStaffQuery : IRequest<IEnumerable<ActiveStaff>> 
{
    public string? Role { get; set; }
}

public class GetActiveStaffQueryHandler : IRequestHandler<GetActiveStaffQuery, IEnumerable<ActiveStaff>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetActiveStaffQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ActiveStaff>> Handle(GetActiveStaffQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        var nameMapping = new Dictionary<string, string>
            {
                {"Principal","Principal" },
                {"AP", "Assistant Principal"}
            };
        return await _context.ActiveStaff
            .Where(x => x.PositionTitle == nameMapping[request.Role ?? ""])
            // .OrderBy(x => x.Title)
            // .ProjectTo<TodoItemBriefDto>(_mapper.ConfigurationProvider)
            // .PaginatedListAsync(request.PageNumber, request.PageSize);
            // .PaginatedListAsync(1, 20);
            .Select(x => new ActiveStaff {
                    StaffUniqueId = x.StaffUniqueId,
                    FullName  = x.FirstName + " " + x.LastSurname, 
                    Age = x.Age,
                    NameOfInstitution = x.NameOfInstitution,
                    SchoolCategory = x.SchoolCategory,
                    // Gender = x.Gender,
                    // Race = x.Race,
                    // VacancyCause = x.VacancyCause,
                    // SchoolYear = x.SchoolYear,
                    PositionTitle = x.PositionTitle,
                    Rating = x.Rating,
                    RetirementEligibility = x.RetirementEligibility,
                    YearsOfService = x.YearsOfService,
                    YearsToRetirement = x.YearsToRetirement,
                    // OverallScore = x.OverallScore
            })
            // .Take(20)
            // .OrderBy(x => x.NameOfInstitution)
            // .GroupBy(x => x.NameOfInstitution)
            // .OrderByDescending(x => x.Name)
            // .Select (g => new { School = g.Key, Payments = g })
            .ToListAsync();
    }
}
