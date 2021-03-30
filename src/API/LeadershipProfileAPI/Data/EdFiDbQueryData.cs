using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using LeadershipProfileAPI.Extensions;
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
        /// Method sends raw SQL to the database and returns a queryable, paginated, collection of ProfileList
        /// objects sorted by a field and direction
        /// </summary>
        /// <param name="sortBy">Direction to sort the data</param>
        /// <param name="sortField">Field to sort data on</param>
        /// <param name="currentPage">When paginating the data, which page of data should be returned</param>
        /// <param name="pageSize">The number of records returned in the result</param>
        /// <returns></returns>
        public IQueryable<ProfileList> GetProfileList(string sortBy = "asc", string sortField = "name", int currentPage = 1, int pageSize = 10)
        {
            // Map the UI sorted field name to a table field name
            var fieldMapping = new Dictionary<string, string>
                {
                    { "id", "StaffUSI" },
                    { "name", "LastSurName" },
                    { "location", "Location" },
                    { "school", "Institution" },
                    { "position", "Position" },
                    { "yearsOfService", "YearsOfService" },
                    { "highestDegree", "HighestDegree" },
                    { "major", "Major" }
                };

            var sql = $@"
                select
                     StaffUSI
                    ,StaffUniqueId
                    ,FirstName
                    ,MiddleName
                    ,LastSurname
                    ,Location
                    ,Institution
                    ,YearsOfService
                    ,HighestDegree
                    ,Email
                    ,Position
                    ,Telephone
                    ,Major
                from edfi.vw_LeadershipProfileList
                order by case when {fieldMapping[sortField]} is null then 1 else 0 end, {fieldMapping[sortField]} {sortBy}
                offset {((currentPage - 1) * pageSize)} rows
                fetch next {pageSize} rows only
            ";

            return _edfiDbContext.ProfileList.FromSqlRaw(sql);
        }

        /// <summary>
        /// Method sends raw SQL to the database and returns a queryable, paginated, collection of Staff records
        /// matching the criteria and sorted by a field and direction
        /// </summary>
        /// <param name="sortBy">Direction to sort the data</param>
        /// <param name="sortField">Field to sort data on</param>
        /// <param name="currentPage">When paginating the data, which page of data should be returned</param>
        /// <param name="pageSize">The number of records returned in the result</param>
        /// <returns></returns>
        public IQueryable<StaffSearch> GetSearchResults(ProfileSearchRequestBody body, string sortBy = "asc", string sortField = "name", int currentPage = 1, int pageSize = 10)
        {
            // Map the UI sorted field name to a table field name
            var fieldMapping = new Dictionary<string, string>
                {
                    { "id", "StaffUniqueId" },
                    { "name", "LastSurName" },
                    { "yearsOfService", "YearsOfService" },
                    { "certification", "Certification" },
                    { "assignment", "Assignment" },
                    { "degree", "Degree" },
                    { "ratingCategory", "RatingCategory" },
                    { "ratingSubCategory", "RatingSubCategory" },
                    { "rating", "rating"}
                };

            // Implement the view in SQL, call it here
            var sql = $@"
                select
                     StaffUsi
                    ,StaffUniqueId
                    ,FirstName
                    ,MiddleName
                    ,LastSurname
                    ,FullName
                    ,YearsOfService
	                ,Assignment
                    ,Certification
                    ,Degree
                    ,RatingCategory
                    ,RatingSubCategory
                    ,Rating
                from edfi.vw_StaffSearch
                {(ClauseConditions(body))}
                order by case when {fieldMapping[sortField]} is null then 1 else 0 end, {fieldMapping[sortField]} {sortBy}
                offset {((currentPage - 1) * pageSize)} rows
                fetch next {pageSize} rows only
            ";

            return _edfiDbContext.StaffSearches.FromSqlRaw(sql);
        }

        private static string ClauseConditions(ProfileSearchRequestBody body)
        {
            var yearConditions = ClauseYears(body.MinYears, body.MaxYears);
            var assignmentsConditions = ClauseAssignments(body.Assignments);
            var certificatesConditions = ClauseCertifications(body.Certifications);
            var degreesConditions = ClauseDegrees(body.Degrees);
            var ratingsConditions = ClauseRatings(body.Ratings);

            var conditions = new List<string>();

            conditions.AddIfNotNullOrWhiteSpace(yearConditions);
            conditions.AddIfNotNullOrWhiteSpace(assignmentsConditions);
            conditions.AddIfNotNullOrWhiteSpace(certificatesConditions);
            conditions.AddIfNotNullOrWhiteSpace(degreesConditions);
            conditions.AddIfNotNullOrWhiteSpace(ratingsConditions);

            // Join the strings and separate them with 'and'
            var whereCondition = string.Join(" and ", conditions);

            if (!string.IsNullOrWhiteSpace(whereCondition))
            {
                return $"where {whereCondition}";
            }

            return "--where excluded, no conditions provided";
        }

        // Provide the condition being searched for matching your schema. Example: "(y.YearsOfService >= min and y.YearsOfService <= max)"
        private static string ClauseYears(int min, int max) => $""; // Provide the condition being searched for matching your schema. Example: "(y.YearsOfService >= min and y.YearsOfService <= max)"

        private static string ClauseAssignments(ProfileSearchRequestAssignments assignments)
        {
            if (assignments != null)
            {
                // Provide the condition being searched for matching your schema. Examples: "(a.StartDate = '1982-07-14')" or "(a.StartDate = '1982-07-14' and a.PositionId IN (5432, 234, 5331, 34))"
                return $"";
            }

            return string.Empty;
        }

        private static string ClauseCertifications(ProfileSearchRequestCertifications certifications)
        {
            if (certifications != null)
            {
                // Provide the condition being searched for matching your schema. Examples: "(c.IssueDate = '2017-04-23')" or "(c.IssueDate = '2017-04-23' and c.CerfificationId IN (234, 12, 98))"
                return $"";
            }

            return string.Empty;
        }

        private static string ClauseDegrees(ProfileSearchRequestDegrees degrees)
        {
            if (degrees != null)
            {
                // Provide the condition being searched for matching your schema. Example: "(d.DegreeId = 68)"
                return $"";
            }

            return string.Empty;
        }

        private static string ClauseRatings(ProfileSearchRequestRatings ratings)
        {
            if (ratings != null)
            {
                // Provide the condition being searched for matching your schema. Examples: "(r.Rating = 3)" or "(r.Rating = 3 and r.RatingCateogryId = 45)"
                return $"";
            }

            return string.Empty;
        }
    }
}
