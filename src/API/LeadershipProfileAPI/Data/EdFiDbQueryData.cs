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
        // public Task<List<StaffSearch>> GetVacancyProjectionAsync(ProfileVacancyProjectionRequestBody body,
        //     string sortBy = "asc", string sortField = "name", int currentPage = 1, int pageSize = 10)
        // {
        //     // Map the UI sorted field name to a table field name
        //     var fieldMapping = new Dictionary<string, string>
        //     {
        //         {"id", "StaffUniqueId"},
        //         {"name", "LastSurName"},
        //         {"yearsOfService", "YearsOfService"},
        //         {"position", "Assignment"},
        //         {"highestDegree", "Degree"},
        //         // {"highestDegree", "Degree"},
        //         {"school", "Institution"},
        //     };

        //     // Add the 'name' value as sql parameter to avoid SQL injection from raw text
        //     var name = new SqlParameter("name", body?.Name ?? string.Empty);

        //     // Implement the view in SQL, call it here
        //     var sql = $@"
        //         select 
        //              DISTINCT(s.StaffUSI)
        //             ,StaffUniqueId
        //             ,FirstName
        //             ,MiddleName
        //             ,LastSurname
        //             ,FullName
        //             ,YearsOfService
        //             ,Assignment
        //             ,Institution
        //             ,Degree
        //             ,Email
        //             ,Telephone
        //         from edfi.vw_StaffSearch s
        //         {ClauseRatingsConditionalJoin(body)}
        //         {ClauseConditions(body)}
        //         order by {fieldMapping[sortField]} {sortBy}
        //      ";
        //         // offset {(currentPage - 1) * pageSize} rows
        //         // fetch next {pageSize} rows only

        //         //If you passed pageSize 0 then won't apply pagination
        //     if (currentPage != 0) { 
        //         sql += $@"
        //         offset {(currentPage - 1) * pageSize} rows
        //         fetch next {pageSize} rows only
        //         ";
        //     }
        //     return _edfiDbContext.StaffSearches.FromSqlRaw(sql, name).ToListAsync();
        // }

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
        public Task<List<LeaderSearch>> GetLeaderSearchResultsAsync(int[] Roles, int[] SchoolLevels, int[] HighestDegrees, int[] HasCertification, int[] OverallScore)
        {
            // Map the UI sorted field name to a table field name
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

            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            string roles = System.String.Join(",", Roles);
            var name = new SqlParameter("roles", roles);

            // Implement the view in SQL, call it here

            var sql = $@"
                select TOP 10
                     
                    *
                from dbo.[vw_StaffVacancy] s
                
                {LeadersClauseConditions(Roles, SchoolLevels, HighestDegrees, HasCertification, OverallScore)}
                order by s.SchoolYear
             ";
            return _edfiDbContext.LeaderSearches.FromSqlRaw(sql, name).ToListAsync();
        }

        private static string LeadersClauseConditions(int[] Roles, int[] SchoolLevels, int[] HighestDegrees, int[] HasCertification, int[] OverallScore)
        {
            // if (body == null) return "--where excluded, no body provided";

            var rolesDictionary = new Dictionary<int, string>();

            rolesDictionary.Add(1, "Principal");
            rolesDictionary.Add(2, "AP");
            rolesDictionary.Add(3, "Teacher");
            rolesDictionary.Add(4, "Teacher Leader");
            var schoolLevelsDictionary = new Dictionary<int, string>();
            schoolLevelsDictionary.Add(1, "EL");
            schoolLevelsDictionary.Add(2, "MS");
            schoolLevelsDictionary.Add(3, "HS");
            var degreesDictionary = new Dictionary<int, string>();
            degreesDictionary.Add(1, "Bachelors");
            degreesDictionary.Add(2, "Masters");
            degreesDictionary.Add(3, "Doctorate");
            var scoreDictionary = new Dictionary<int, string>();
            scoreDictionary.Add(1, "1");
            scoreDictionary.Add(2, "2");
            scoreDictionary.Add(3, "3");
            scoreDictionary.Add(4, "4");
            scoreDictionary.Add(5, "5");

            var whereCondition = new[]
                {
                    Clause(Roles, rolesDictionary, "PositionTitle"),
                    Clause(SchoolLevels, schoolLevelsDictionary, "SchoolLevel"),
                    Clause(OverallScore, scoreDictionary, "OverallScore"),
                    // Clause(Domain1, scoreDictionary, "Domain1"),
                    // Clause(Domain2, scoreDictionary, "Domain2"),
                    // Clause(Domain3, scoreDictionary, "Domain3"),
                    // Clause(Domain4, scoreDictionary, "Domain4"),
                    // Clause(Domain5, scoreDictionary, "Domain5")
                    // Clause(HighestDegrees, degreesDictionary, "PositionTitle"),
                    // Clause(HasCertification, hasCertificationDictionary, "PositionTitle"),
                }
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .DefaultIfEmpty(string.Empty)
                .Aggregate((x, y) => $"{x} and {y}");

            return !string.IsNullOrWhiteSpace(whereCondition)
                ? $"where {whereCondition}"
                : "--where excluded, no conditions provided";
        }

        private static string Clause(int[] clause, Dictionary<int, string> clauseValues, string propertyName)
        {
            if (clause != null && clause.Any())
            {
                List<string> values = new List<string> { };
                foreach (KeyValuePair<int, string> entry in clauseValues) {
                    if (clause.Any(r => r == entry.Key)) values.Add(entry.Value);
                }
                // Provide the condition being searched for matching your schema. Example: "(d.DegreeId = 68)"
                var whereProperty = clause.Any() ? $"{propertyName} in ('{string.Join("','", values)}')" : string.Empty;

                return $"({whereProperty})";
            }

            return string.Empty;
        }


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
        public Task<List<StaffVacancy>> GetVacancyProjectionResultsAsync(string Role)
        {

            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            var name = new SqlParameter("role", Role ?? string.Empty);

            // Implement the view in SQL, call it here
            // var whereClause = Role != null ?
            //     "WHERE [PositionTitle] "
            //     + (Role == "Principal" ? "NOT " : "")
            //     + "LIKE '%ASSIS%'" : "";
                        var whereClause = Role != null ?
                "WHERE [PositionTitle] = "
                + (Role == "Principal" ? "'Principal'" : "'AP'")
                : "";
            // DISTINCT(s.[Full Name Annon]),
            var sql = $@"
                select                 
                    *
                from dbo.[vw_StaffVacancy] s
                {whereClause}
                order by s.SchoolYear                
             ";
            //  from dbo.[vw_StaffVacancy] s
            return _edfiDbContext.StaffVacancies.FromSqlRaw(sql, name).ToListAsync();
        }

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
                // {"highestDegree", "Degree"},
                {"school", "Institution"},
            };

            // Add the 'name' value as sql parameter to avoid SQL injection from raw text
            var name = new SqlParameter("name", body?.Name ?? string.Empty);

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
                from edfi.vw_StaffSearch s
                {ClauseRatingsConditionalJoin(body)}
                {ClauseConditions(body)}
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
                    ClauseSchoolCategory(body.SchoolCategories),
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

        private static string ClauseSchoolCategory(ProfileSearchRequestSchoolCategories schoolCategories)
        {
            if (schoolCategories != null && schoolCategories.Values.Any())
            {
                var whereInstitutions = schoolCategories.Values.Any() ? $"InstitutionCategoryId in ({string.Join(",", schoolCategories.Values)})" : string.Empty;

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