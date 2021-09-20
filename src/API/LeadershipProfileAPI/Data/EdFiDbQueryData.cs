using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data
{
    /// <summary>
    /// The EdFiDbQueryData provides alternative options to query dbContext when
    /// more complex queries are required.
    /// </summary>
    public class EdFiDbQueryData
    {
        private readonly EdFiDbContext _edfiDbContext;

        /// <summary>
        /// Initializes a new instance of the class
        /// </summary>
        /// <param name="edfiDbContext"></param>
        public EdFiDbQueryData(EdFiDbContext edfiDbContext) => _edfiDbContext = edfiDbContext;

        /// <summary>
        /// Method sends raw SQL to the database and returns a queryable, paginated, collection of Staff records
        /// matching the criteria and sorted by a field and direction
        /// </summary>
        /// <param name="body">Query parameters from the request body</param>
        /// <param name="sortBy">Direction to sort the data</param>
        /// <param name="sortField">Field to sort data on</param>
        /// <param name="currentPage">When paginating the data, which page of data should be returned</param>
        /// <param name="pageSize">The number of records returned in the result</param>
        /// <returns></returns>
        public Task<List<StaffSearch>> GetSearchResultsAsync(ProfileSearchRequestBody body,
            string sortBy = "asc", string sortField = "name", int currentPage = 1, int pageSize = 10)
        {
            // Map the UI sorted field name to a table field name
            var fieldMapping = new Dictionary<string, string>
            {
                {"id", "StaffUniqueId"},
                {"name", "LastSurName"},
                {"yearsOfService", "YearsOfService"},
                {"position", "Assignment"},
                {"highestDegree", "Degree"},
                {"school", "Institution"},
            };

            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            var name = new SqlParameter("name", body?.Name ?? string.Empty);

            // Implement the view in SQL, call it here
            var sql = $@"
                select 
                     s.StaffUSI
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
                from edfi.vw_StaffSearch s
                {ClauseRatingsConditionalJoin(body)}
                {ClauseConditions(body)}
                order by case when {fieldMapping[sortField]} is null then 1 else 0 end, {fieldMapping[sortField]} {sortBy}
                offset {(currentPage - 1) * pageSize} rows
                fetch next {pageSize} rows only
             ";
            return _edfiDbContext.StaffSearches.FromSqlRaw(sql, name).ToListAsync();
        }

        public async Task<int> GetSearchResultsTotalsAsync(ProfileSearchRequestBody body)
        {
            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            var name = new SqlParameter("name", body?.Name ?? string.Empty);

            // Implement the view in SQL, call it here
            var sql = $@"
                 select StaffUSI from edfi.vw_StaffSearch
                 {ClauseConditions(body)}
             ";

            return await _edfiDbContext.StaffSearches.FromSqlRaw(sql, name).CountAsync();
        }

        private string ClauseRatingsConditionalJoin(ProfileSearchRequestBody body)
        {
            if (body == null || body.Ratings == null || !body.Ratings.IsPopulated)
                return string.Empty;

            var joinOnStaff = "JOIN edfi.vw_StaffObjectiveRatings ratings ON ratings.StaffUSI = s.StaffUSI";

            var onCategory = $" AND ratings.Category = '{body.Ratings.Category}'";
            var andScore = body.Ratings.Score > 0 ? $" AND ratings.Rating >= {body.Ratings.Score}" : string.Empty;

            return $"{joinOnStaff}{onCategory}{andScore}";
        }

        private static string ClauseConditions(ProfileSearchRequestBody body)
        {
            if (body == null) return "--where excluded, no body provided";

            var whereCondition = new[]
                {
                    ClauseAssignments(body.Assignments),
                    ClauseDegrees(body.Degrees),
                    ClauseName(),
                    ClauseInstitution(body.Institutions),
                    ClauseYearsOfExperience(body.YearsOfPriorExperienceRanges)
                }
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .DefaultIfEmpty(string.Empty)
                .Aggregate((x, y) => $"{x} and {y}");

            return !string.IsNullOrWhiteSpace(whereCondition)
                ? $"where {whereCondition}"
                : "--where excluded, no conditions provided";
        }

        private static string ClauseAssignments(ProfileSearchRequestAssignments assignments)
        {
            return assignments != null && (assignments.Values.Any())
                ? $"(StaffClassificationDescriptorId in ({string.Join(",", assignments.Values)}))"
                : string.Empty;
        }

        private static string ClauseDegrees(ProfileSearchRequestDegrees degrees)
        {
            if (degrees != null && degrees.Values.Any())
            {
                // Provide the condition being searched for matching your schema. Example: "(d.DegreeId = 68)"
                var whereDegrees = degrees.Values.Any() ? $"HighestCompletedLevelOfEducationDescriptorId in ({string.Join(",", degrees.Values)})" : string.Empty;

                return $"({whereDegrees})";
            }

            return string.Empty;
        }

        private static string ClauseName()
        {
            return "(coalesce(TRIM(@name), '') = '' OR FullName LIKE '%' + @name + '%')";
        }

        private static string ClauseInstitution(ProfileSearchRequestInstitution institutions)
        {
            if (institutions != null && institutions.Values.Any())
            {
                var whereInstitutions = institutions.Values.Any() ? $"InstitutionId in ({string.Join(",", institutions.Values)})" : string.Empty;

                return $"({whereInstitutions})";
            }
            return string.Empty;
        }

        private static string ClauseYearsOfExperience(ProfileSearchYearsOfPriorExperience yearsOfPriorExperienceRanges)
        {
            var whereTenure = string.Empty;
            var rangesCounter = 0;
            if (yearsOfPriorExperienceRanges == null || yearsOfPriorExperienceRanges.Values.Count <= 0)
                return whereTenure;

            foreach (var range in yearsOfPriorExperienceRanges.Values)
            {
                var totalRanges = yearsOfPriorExperienceRanges.Values.Count;
                var orCondition = totalRanges > 1 && totalRanges - 1 != rangesCounter ? "OR " : string.Empty;
                whereTenure += $"YearsOfService BETWEEN {range.Min} AND {range.Max} {orCondition}";
                rangesCounter++;
            }

            return whereTenure;
        }
    }
}