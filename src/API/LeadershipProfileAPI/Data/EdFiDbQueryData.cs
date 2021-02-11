using System.Collections.Generic;
using System.Linq;
using LeadershipProfileAPI.Data.Models;
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

        #region ProfileList Members

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
                    { "id", "StaffUniqueId" },
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

        #endregion
    }
}
