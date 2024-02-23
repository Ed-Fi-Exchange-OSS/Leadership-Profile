// using LeadershipProfile.Application.Common.Interfaces;
// using LeadershipProfile.Application.Common.Mappings;
// using LeadershipProfile.Application.Common.Models;
// using LeadershipProfile.Domain.Entities;
// using LeadershipProfile.Domain.Entities.ProfileSearchRequest;
// using Microsoft.Data.SqlClient;
// using System.Linq;
// using System.Runtime.CompilerServices;



// namespace LeadershipProfile.Application.Search.Queries.GetSearchResultsWithPagination;

// public record GetSearchResultsWithPaginationQuery : IRequest<PaginatedList<SearchResultDto>>
// {
//             public int PageNumber { get; set; } = 1;
//             public required string SortField { get; set; } = "";
//             public required string SortBy { get; set; } = "";
//             public bool OnlyActive { get; set; } = true;
//             // public required ProfileSearchRequestBody SearchRequestBody { get; set; }

//             // GetSearchResultsWithPaginationQuery(int page, string sortField, string sortBy, bool onlyActive, ProfileSearchRequestBody searchRequestBody) {
//             //     this.Page = page;
//             //     this.SortField = sortField;
//             //     this.SortBy = sortBy;
//             //     this.OnlyActive = onlyActive;
//             //     this.SearchRequestBody = searchRequestBody;
//             // }
// }

// public class GetSearchResultsWithPaginationQueryHandler : IRequestHandler<GetSearchResultsWithPaginationQuery, PaginatedList<SearchResultDto>>
// {
//     private readonly IApplicationDbContext _context;
//     private readonly IMapper _mapper;

//     public GetSearchResultsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
//     {
//         _context = context;
//         _mapper = mapper;
//     }

//     public async Task<PaginatedList<SearchResultDto>> Handle(GetSearchResultsWithPaginationQuery request, CancellationToken cancellationToken)
//     {
//         var fieldMapping = new Dictionary<string, string>
//             {
//                 {"id", "StaffUniqueId"},
//                 {"name", "LastSurName"},
//                 {"yearsOfService", "YearsOfService"},
//                 {"position", "Assignment"},
//                 {"highestDegree", "Degree"},
//                 // {"highestDegree", "Degree"},
//                 {"school", "Institution"},
//             };

//             // Add the 'name' value as sql parameter to avoid SQL injection from raw text
//         var name = new SqlParameter("name", request.SearchRequestBody?.Name ?? string.Empty);

//         var sql = $@"
//                 select
//                      DISTINCT(s.StaffUSI)
//                     ,StaffUniqueId
//                     ,FirstName
//                     ,MiddleName
//                     ,LastSurname
//                     ,FullName
//                     ,YearsOfService
//                     ,Assignment
//                     ,Institution
//                     ,Degree
//                     ,Email
//                     ,Telephone
//                 from edfi.vw_StaffSearch s
//                 {ClauseRatingsConditionalJoin(request.SearchRequestBody)}
                
//                 {ClauseConditions(request.SearchRequestBody, request.OnlyActive)}
//                 order by {fieldMapping[request.SortField]} {request.SortBy}
//              ";
//         var fs = FormattableStringFactory.Create(sql);


//         return await _context.StaffSearches.FromSqlInterpolated(fs)
//             // .Where(x => x.ListId == request.ListId)
//             // .OrderBy(x => x.Title)
//             .ProjectTo<SearchResultDto>(_mapper.ConfigurationProvider)
//             // .ToList();
//             .PaginatedListAsync(request.PageNumber, 15);
//     }

//     private string ClauseRatingsConditionalJoin(ProfileSearchRequestBody? body)
//         {
//             if(body?.Ratings?.Any(r => r.IsPopulated) != true) return string.Empty;

//             var count = body.Ratings.Where(r => r.IsPopulated).Count();
//             var scoreFilter = string.Join(" OR ", body.Ratings.Where(r => r.IsPopulated)
//                 .Select(r => $"(ratings.Category = '{r.Category}' {(r.Score > 0 ? $" AND ratings.Rating >= {r.Score}" : string.Empty)})"));

//             var subQuery = @$"(
//                 select StaffUSI, Count(*) as FiltersPassed
//                     from edfi.vw_StaffObjectiveRatings ratings
//                     where {scoreFilter}
//                     Group by StaffUSI
//                     Having Count(*) >= {count}
//             )";

//             var joinOnStaff = $"JOIN {subQuery} ratings ON ratings.StaffUSI = s.StaffUSI";

//             return joinOnStaff;
//         }



//         private static string ClauseConditions(ProfileSearchRequestBody? body, bool onlyActive = false)
//         {
//             if (body == null) return "--where excluded, no body provided";

//             var whereCondition = new[]
//                 {
//                     ClauseAssignments(body.Assignments),
//                     ClauseDegrees(body.Degrees),
//                     ClauseName(),
//                     ClauseInstitution(body.Institutions),
//                     ClauseSchoolCategory(body.SchoolCategories),
//                     ClauseYearsOfExperience(body.YearsOfPriorExperienceRanges)
//                 }
//                 .Where(x => !string.IsNullOrWhiteSpace(x))
//                 .DefaultIfEmpty(string.Empty)
//                 .Aggregate((x, y) => $"{x} and {y}");

//             if (onlyActive)
//                 whereCondition += " and s.StaffUSI in (select StaffUSI from edfi.StaffEducationOrganizationEmploymentAssociation where EndDate is null)";

//             return !string.IsNullOrWhiteSpace(whereCondition)
//                 ? $"where {whereCondition}"
//                 : "--where excluded, no conditions provided";
//         }

//         private static string ClauseAssignments(ProfileSearchRequestAssignments assignments)
//         {
//             return assignments != null && assignments.Values?.Count > 0
//                 ? $"(StaffClassificationDescriptorId in ({string.Join(",", assignments.Values)}))"
//                 : string.Empty;
//         }

//         private static string ClauseDegrees(ProfileSearchRequestDegrees degrees)
//         {
//             if (degrees != null && degrees.Values?.Count > 0)
//             {
//                 // Provide the condition being searched for matching your schema. Example: "(d.DegreeId = 68)"
//                 var whereDegrees = degrees.Values.Any() ? $"HighestCompletedLevelOfEducationDescriptorId in ({string.Join(",", degrees.Values)})" : string.Empty;

//                 return $"({whereDegrees})";
//             }

//             return string.Empty;
//         }

//         private static string ClauseName()
//         {
//             return "(coalesce(TRIM(@name), '') = '' OR FullName LIKE '%' + @name + '%')";
//         }

//         private static string ClauseInstitution(ProfileSearchRequestInstitution institutions)
//         {
//             if (institutions != null && institutions.Values?.Count > 0)
//             {
//                 var whereInstitutions = institutions.Values.Any() ? $"InstitutionId in ({string.Join(",", institutions.Values)})" : string.Empty;

//                 return $"({whereInstitutions})";
//             }
//             return string.Empty;
//         }

//         private static string ClauseSchoolCategory(ProfileSearchRequestSchoolCategories schoolCategories)
//         {
//             if (schoolCategories != null && schoolCategories.Values?.Count > 0)
//             {
//                 var whereInstitutions = schoolCategories.Values.Any() ? $"InstitutionCategoryId in ({string.Join(",", schoolCategories.Values)})" : string.Empty;

//                 return $"({whereInstitutions})";
//             }
//             return string.Empty;
//         }

//         private static string ClauseYearsOfExperience(ProfileSearchYearsOfPriorExperience yearsOfPriorExperienceRanges)
//         {
//             var whereTenure = string.Empty;
//             var rangesCounter = 0;
//             if (yearsOfPriorExperienceRanges == null || yearsOfPriorExperienceRanges.Values?.Count <= 0)
//                 return whereTenure;

//             foreach (var range in yearsOfPriorExperienceRanges.Values ?? [])
//             {
//                 var totalRanges = yearsOfPriorExperienceRanges.Values?.Count;
//                 var orCondition = totalRanges > 1 && totalRanges - 1 != rangesCounter ? "OR " : string.Empty;
//                 whereTenure += $"YearsOfService BETWEEN {range.Min} AND {range.Max} {orCondition}";
//                 rangesCounter++;
//             }

//             return whereTenure;
//         }
// }
