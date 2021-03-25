using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public IEnumerable<StaffPerformanceMeasure> GetStaffPerformanceMeasures(int staffUsi, int startingYear, int numberOfYears = 5)
        {
            var list = new List<StaffPerformanceMeasure>();

            for (int i = 0; i < numberOfYears; i++)
            {
                var sql = $@"
                with allMeasures as (
	                select
		                 pm.PersonBeingReviewedStaffUSI as StaffUsi
		                ,pm.TpdmRubricTypeDescriptorId as Category
		                ,pm.TpdmRubricTitle as SubCategory
		                ,pm.Score
		                ,cast(pm.PerformanceMeasureComment as varchar(1000)) as Comments
		                ,pm.ActualDateOfPerformanceMeasure as MeasureDate
	                from extension.PerformanceMeasure as pm
	                where year(pm.ActualDateOfPerformanceMeasure) = {startingYear - i}
                )
                , mostrecent as (
	                select
		                 StaffUsi
		                ,Category
		                ,SubCategory
		                ,max(MeasureDate) as MeasureDate
	                from allMeasures
	                group by 
		                 Category
		                ,SubCategory
		                ,StaffUsi
                )
                , rubric as (
	                select 
		                 de.CodeValue as MeasureCategory
		                ,de.DescriptorID
	                from edfi.Descriptor as de
	                join extension.RubricTypeDescriptor as rtd on rtd.RubricTypeDescriptorID = de.DescriptorID
                )
                ,district as (
	                select
		                 pm.TpdmRubricTypeDescriptorId
		                ,pm.TpdmRubricTitle
		                ,min(cast(pm.Score as decimal(5,2))) as DistrictMin
		                ,max(cast(pm.Score as decimal(5,2))) as DistrictMax
		                ,cast(avg(cast(pm.Score as decimal(5,2))) as decimal(5,2)) as DistrictAvg
	                from extension.PerformanceMeasure as pm
	                group by pm.TpdmRubricTypeDescriptorId, pm.TpdmRubricTitle
                )

                select
	                 mr.StaffUsi
	                ,ru.MeasureCategory as Category
	                ,mr.SubCategory
	                ,year(mr.MeasureDate) as [Year]
	                ,di.DistrictMin
	                ,di.DistrictMax
	                ,di.DistrictAvg
	                ,cast(pm.Score as decimal(5,2)) as Score
	                ,pm.PerformanceMeasureComment
	                ,mr.MeasureDate
                from extension.PerformanceMeasure as pm
                inner join mostrecent as mr on mr.Category = pm.TpdmRubricTypeDescriptorId
	                and mr.SubCategory = pm.TpdmRubricTitle
	                and mr.StaffUsi = pm.PersonBeingReviewedStaffUSI
	                and mr.MeasureDate = pm.ActualDateOfPerformanceMeasure
                left join rubric as ru on ru.DescriptorId = pm.TpdmRubricTypeDescriptorId
                left join district as di on di.TpdmRubricTypeDescriptorId = pm.TpdmRubricTypeDescriptorId and di.TpdmRubricTitle = pm.TpdmRubricTitle
                where mr.StaffUsi = {staffUsi}
                order by Category, SubCategory, year(mr.MeasureDate)
            ";

                list.AddRange(_edfiDbContext.StaffPerformanceMeasures.FromSqlRaw(sql).ToList());
            }

            return list;
        }
    }
}
