using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Application.Common.Mappings;
using LeadershipProfile.Application.Common.Models;
using LeadershipProfileAPI.Extensions;


namespace LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

public record GetLeadersWithPaginationQuery : IRequest<List<LeaderBriefDto>>
{
    public int ListId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public required int[] Roles { get; set; }
    public required int[] SchoolLevels { get; set; }
    public required int[] HighestDegrees { get; set; }
    public required int[] HasCertification { get; set; }
    public required int[] YearsOfExperience { get; set; }
    public required int[] OverallScore { get; set; }
    public required int[] DomainOneScore { get; set; }
    public required int[] DomainTwoScore { get; set; }
    public required int[] DomainThreeScore { get; set; }
    public required int[] DomainFourScore { get; set; }
    public required int[] DomainFiveScore { get; set; }
}

public class GetLeadersWithPaginationQueryHandler : IRequestHandler<GetLeadersWithPaginationQuery, List<LeaderBriefDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private static readonly Dictionary<int, string?> _rolesDictionary = new() {
                {1, "Principal"},
                {2, "Assistant Principal"},
                {3, "Teacher"},
                {4, "Teacher Leader"}
            };
    private static readonly Dictionary<int, string?> _schoolLevelsDictionary = new() {
                {1, "Elementary School"},
                {2, "Middle School"},
                {3, "High School"}
            };
    private static readonly Dictionary<int, string> _degreesDictionary = new(){
                {1, "Bachelors"},
                {2, "Masters"},
                {3, "Doctorate"}
            };
    public GetLeadersWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    

    public async Task<List<LeaderBriefDto>> Handle(GetLeadersWithPaginationQuery request, CancellationToken cancellationToken)
    {

        var results = await GetLeaderSearchResultsAsync(
                    request.Roles,
                    request.SchoolLevels,
                    request.HighestDegrees,
                    request.HasCertification,
                    request.YearsOfExperience,
                    request.OverallScore,
                    request.DomainOneScore,
                    request.DomainTwoScore,
                    request.DomainThreeScore,
                    request.DomainFourScore,
                    request.DomainFiveScore
                );
        return results;

        // return await _context.LeaderSearches
        //     // .Where(x => x.ListId == request.ListId)
        //     .OrderBy(x => x.FullNameAnnon)
        //     .ProjectTo<LeaderBriefDto>(_mapper.ConfigurationProvider)
        //     .PaginatedListAsync(request.PageNumber, request.PageSize);
    }

    public Task<List<LeaderBriefDto>> GetLeaderSearchResultsAsync(
            int[] Roles,
            int[] SchoolLevels,
            int[] HighestDegrees,
            int[] HasCertification,
            int[] YearsOfExperience,
            int[] OverallScore,
            int[] DomainOneScore,
            int[] DomainTwoScore,
            int[] DomainThreeScore,
            int[] DomainFourScore,
            int[] DomainFiveScore
        )
        {
            var result = _context.LeaderSearches.AsQueryable()
                .ApplyMappedListFilter(Roles, _rolesDictionary, s => s.PositionTitle)
                .ApplyMappedListFilter(SchoolLevels, _schoolLevelsDictionary, s => s.SchoolLevel)
                .ApplyRangeFilter(OverallScore.Select(i => (double)i).ToArray(), s => s.OverallScore)
                .ApplyRangeFilter(DomainOneScore.Select(i => (double)i).ToArray(), s => s.Domain1)
                .ApplyRangeFilter(DomainTwoScore.Select(i => (double)i).ToArray(), s => s.Domain2)
                .ApplyRangeFilter(DomainThreeScore.Select(i => (double)i).ToArray(), s => s.Domain3)
                .ApplyRangeFilter(DomainFourScore.Select(i => (double)i).ToArray(), s => s.Domain4)
                .ApplyRangeFilter(DomainFiveScore.Select(i => (double)i).ToArray(), s => s.Domain5)
                .Select(l => new LeaderBriefDto {
                    StaffUniqueId = l.StaffUniqueId,
                    FullNameAnnon = l.FullNameAnnon,
                    SchoolLevel = l.SchoolLevel,
                    SchoolNameAnnon = l.SchoolNameAnnon,
                    Job = l.Job,
                    TotYrsExp = l.TotYrsExp,
                    Race = l.Race,
                    Gender = l.Gender,
                    Domain1 = l.Domain1,
                    Domain2 = l.Domain2,
                    Domain3 = l.Domain3,
                    Domain4 = l.Domain4,
                    Domain5 = l.Domain5,
                    OverallScore = l.OverallScore
                })
                .Distinct()
                .Take(10);

            return result.ToListAsync();
        }
}
