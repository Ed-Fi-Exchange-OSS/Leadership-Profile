using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Extensions;
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
        private static readonly Dictionary<int, string> _rolesDictionary = new() {
                {1, "Principal"},
                {2, "Assistant Principal"},
                {3, "Teacher"},
                {4, "Teacher Leader"}
            };
        private static readonly Dictionary<int, string> _schoolLevelsDictionary = new() {
                {1, "Elementary School"},
                {2, "Middle School"},
                {3, "High School"}
            };
        private static readonly Dictionary<int, string> _degreesDictionary = new(){
                {1, "Bachelors"},
                {2, "Masters"},
                {3, "Doctorate"}
            };


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

        public Task<List<LeaderSearch>> GetLeaderSearchResultsAsync(
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
            var result = _edfiDbContext.LeaderSearches.AsQueryable()
                .ApplyMappedListFilter(Roles, _rolesDictionary, s => s.PositionTitle)
                .ApplyMappedListFilter(SchoolLevels, _schoolLevelsDictionary, s => s.SchoolLevel)
                .ApplyRangeFilter(OverallScore?.Select(i => (double)i).ToArray(), s => s.OverallScore)
                .ApplyRangeFilter(DomainOneScore?.Select(i => (double)i).ToArray(), s => s.Domain1)
                .ApplyRangeFilter(DomainTwoScore?.Select(i => (double)i).ToArray(), s => s.Domain2)
                .ApplyRangeFilter(DomainThreeScore?.Select(i => (double)i).ToArray(), s => s.Domain3)
                .ApplyRangeFilter(DomainFourScore?.Select(i => (double)i).ToArray(), s => s.Domain4)
                .ApplyRangeFilter(DomainFiveScore?.Select(i => (double)i).ToArray(), s => s.Domain5)
                .Select(l => new LeaderSearch {
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

        private static string LeadersClauseConditions(
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
            // if (body == null) return "--where excluded, no body provided";

            var rolesDictionary = new Dictionary<int, string>();

            rolesDictionary.Add(1, "Principal");
            rolesDictionary.Add(2, "Assistant Principal");
            rolesDictionary.Add(3, "Teacher");
            rolesDictionary.Add(4, "Teacher Leader");
            var schoolLevelsDictionary = new Dictionary<int, string>();
            schoolLevelsDictionary.Add(1, "Elementary School");
            schoolLevelsDictionary.Add(2, "Middle School");
            schoolLevelsDictionary.Add(3, "High School");
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
                    Clause(DomainOneScore, scoreDictionary, "Domain1"),
                    Clause(DomainTwoScore, scoreDictionary, "Domain2"),
                    Clause(DomainThreeScore, scoreDictionary, "Domain3"),
                    Clause(DomainFourScore, scoreDictionary, "Domain4"),
                    Clause(DomainFiveScore, scoreDictionary, "Domain5"),
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
                foreach (KeyValuePair<int, string> entry in clauseValues)
                {
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
        static string[] vacancyCauses = new string[] { "Internal Transfer", "Internal Promotion", "Attrition", "Retirement" };
        public Task<List<StaffVacancy>> GetVacancyProjectionResultsAsync(string Role, CancellationToken cancellationToken)
        {
            var query = _edfiDbContext.StaffVacancies.Where(v => vacancyCauses.Contains(v.VacancyCause));
            if (!string.IsNullOrWhiteSpace(Role))
            {
                var queryRole = Role == "Principal" ? "Principal" : "Assistant Principal";
                query = query.Where(v => v.PositionTitle.Equals(queryRole));
            }
            query = query.OrderBy(v => v.SchoolYear);

            return query.ToListAsync(cancellationToken);
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