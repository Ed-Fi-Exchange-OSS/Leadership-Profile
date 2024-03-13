using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Application.Common.Mappings;
using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Domain.Entities;
using LeadershipProfile.Domain.Entities.ProfileSearchRequest;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Runtime.CompilerServices;


namespace LeadershipProfile.Application.Search.Queries.GetAllWithPagination;

public record GetAllWithPaginationQuery : IRequest<PaginatedList<SearchResultDto>>
{
            public int Page { get; set; } = 1;
            public required string SortField { get; set; } = "";
            public required string SortBy { get; set; } = "";
            public bool OnlyActive { get; set; } = true;
            // public required ProfileSearchRequestBody SearchRequestBody { get; set; }

            // GetSearchResultsWithPaginationQuery(int page, string sortField, string sortBy, bool onlyActive, ProfileSearchRequestBody searchRequestBody) {
            //     this.Page = page;
            //     this.SortField = sortField;
            //     this.SortBy = sortBy;
            //     this.OnlyActive = onlyActive;
            //     this.SearchRequestBody = searchRequestBody;
            // }
}

public class GetAllWithPaginationQueryHandler : IRequestHandler<GetAllWithPaginationQuery, PaginatedList<SearchResultDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAllWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<SearchResultDto>> Handle(GetAllWithPaginationQuery request, CancellationToken cancellationToken)
    {
        const int pageSize = 10;
        var results = GetSearchResultsAsync(
            request.SortBy ?? "asc",
            request.SortField ?? "id",
            request.Page,
            pageSize,
            request.OnlyActive);

        return await results.ProjectTo<SearchResultDto>(_mapper.ConfigurationProvider)
            .PaginatedListAsync(request.Page, pageSize);

    }

    private IQueryable<StaffSearch> GetSearchResultsAsync(string sortBy = "asc", string sortField = "name", 
            int currentPage = 1, int pageSize = 10, bool onlyActive = false) {

        var fieldMapping = new Dictionary<string, string>
            {
                {"id", "StaffUniqueId"},
                {"name", "LastSurName"},
                {"yearsOfService", "YearsOfService"},
                {"position", "Assignment"},
                {"highestDegree", "Degree"},
                // {"highestDegree", "Degree"},
                {"school", "Institution"},
            };

            // Implement the view in SQL, call it here
            var sql = $@"
                select
                     DISTINCT(s.StaffUSI)
                    ,StaffUniqueId
                    ,FirstName
                    ,MiddleName
                    ,LastSurname
                    ,FullName
                    ,YearsOfService
                    ,Assignment
                    ,Institution
                    ,Degree
                    ,Email
                    ,Telephone
                    ,a.InterestedInNextRole
                from edfi.vw_StaffSearch
                order by {fieldMapping[sortField]} {sortBy}
             ";
            // offset {(currentPage - 1) * pageSize} rows
            // fetch next {pageSize} rows only

            //If you passed pageSize 0 then won't apply pagination
            if (currentPage != 0)
            {
                sql += $@"
                offset {(currentPage - 1) * pageSize} rows
                fetch next {pageSize} rows only
                ";
            }

            var fs = FormattableStringFactory.Create(sql);
            // return _context.StaffSearches.FromSqlInterpolated(fs)
            // .ProjectTo<SearchResultDto>(_mapper.ConfigurationProvider)
            // .ToList();
            // .PaginatedListAsync(1, 15);
            return _context.StaffSearches.FromSqlRaw(sql);
    }

    private async Task<int> GetSearchResultsTotalsAsync()
        {
            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            var name = new SqlParameter("name", string.Empty);

            // Implement the view in SQL, call it here
            var sql = $@"
                 select s.StaffUSI from edfi.vw_StaffSearch s
             ";

            return await _context.StaffSearches.FromSqlRaw(sql, name).CountAsync();
        }
}
