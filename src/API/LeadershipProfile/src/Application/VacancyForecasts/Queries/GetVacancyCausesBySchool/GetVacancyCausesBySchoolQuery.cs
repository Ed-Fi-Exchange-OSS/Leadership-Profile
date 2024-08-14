// using LeadershipProfile.Application.Common.Interfaces;

// namespace LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyCausesBySchool;

// public record GetVacancyCausesBySchoolQuery : IRequest<IEnumerable<VacancyCausesBySchool>> 
// {
//     public string? Role { get; set; }
// }

// public class GetVacancyCausesBySchoolQueryHandler : IRequestHandler<GetVacancyCausesBySchoolQuery, IEnumerable<VacancyCausesBySchool>>
// {
//     private readonly IApplicationDbContext _context;
//     private readonly IMapper _mapper;

//     public GetVacancyCausesBySchoolQueryHandler(IApplicationDbContext context, IMapper mapper)
//     {
//         _context = context;
//         _mapper = mapper;
//     }

// #pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
//     public async Task<IEnumerable<VacancyCausesBySchool>> Handle(GetVacancyCausesBySchoolQuery request, CancellationToken cancellationToken)
// #pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
//     {
//         var nameMapping = new Dictionary<string, string>
//             {
//                 {"Principal","Principal" },
//                 {"AP", "Assistant Principal"}
//             };
//         return await _context.StaffVacancies
//             .Where(x => x.PositionTitle == nameMapping[request.Role ?? ""])
//             // .OrderBy(x => x.Title)
//             // .ProjectTo<TodoItemBriefDto>(_mapper.ConfigurationProvider)
//             // .PaginatedListAsync(request.PageNumber, request.PageSize);
//             // .PaginatedListAsync(1, 20);
//             .Select(x => new VacancyForecast {
//                     StaffUniqueId = x.StaffUniqueId,
//                     FullNameAnnon  = x.FullNameAnnon, 
//                     Age = x.Age,
//                     SchoolNameAnnon = x.SchoolNameAnnon,
//                     SchoolLevel = x.SchoolLevel,
//                     Gender = x.Gender,
//                     Race = x.Race,
//                     VacancyCause = x.VacancyCause,
//                     SchoolYear = x.SchoolYear,
//                     PositionTitle = x.PositionTitle,
//                     RetElig = x.RetElig,
//                     OverallScore = x.OverallScore
//             })
//             // .Take(20)
//             .ToListAsync();
//     }
// }
