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

        /// <summary>
        /// Method sends raw SQL to the database and returns a queryable, paginated, collection of Staff records
        /// matching the criteria and sorted by a field and direction
        /// </summary>
        /// <param name="sortBy">Direction to sort the data</param>
        /// <param name="sortField">Field to sort data on</param>
        /// <param name="currentPage">When paginating the data, which page of data should be returned</param>
        /// <param name="pageSize">The number of records returned in the result</param>
        /// <returns></returns>
        public async Task<IList<StaffSearch>> GetSearchResultsAsync(ProfileSearchRequestBody body, string sortBy = "asc", string sortField = "name", int currentPage = 1, int pageSize = 10)
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
                ;with staffService as (
                    select
                         StaffUsi
                        ,sum(FLOOR(DATEDIFF(DAY, KleinHireDate, COALESCE(KleinEndDate, getdate()) )/365.0 * 4) / 4) as YearsOfService
                    from extension.KleinStaffEmployment
                    group by StaffUsi
                )
                ,assignments as (
                    select
                         ksa.StaffUSI
                        ,ksa.KleinStaffClassificationDescriptorId
                        ,ksad.CodeValue as [Position]
                        ,ksa.KleinBeginDate as StartDate
                    from extension.KleinStaffAssignment as ksa
                    left join edfi.Descriptor as ksad on ksad.DescriptorId = ksa.KleinStaffClassificationDescriptorId
                )
                ,certDescription as (
                    select distinct
                        Credential.CredentialFieldDescriptorId
                        , theDescriptors.CodeValue [Credential Field]
                        , AcademicSubjectType.CodeValue [Certification Academic Subject]
                        , AcademicSubjectType.Description [Certification Academic Subject Description]
                    from EdFi.CredentialFieldDescriptor
                    left join extension.Credential
                        on Credential.CredentialFieldDescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
                    left join EdFi.Descriptor theDescriptors
                        on theDescriptors.DescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
                    left join EdFi.AcademicSubjectDescriptor
                        on AcademicSubjectDescriptor.AcademicSubjectDescriptorId = CredentialFieldDescriptor.AcademicSubjectDescriptorId
                    left join EdFi.AcademicSubjectType
                        on AcademicSubjectType.AcademicSubjectTypeId = AcademicSubjectDescriptor.AcademicSubjectTypeId
                )
                ,certifications as (
                    select
                         sc.StaffUSI
                        ,cd.CredentialFieldDescriptorId
                        ,COALESCE(cd.[Certification Academic Subject], cd.[Credential Field]) [Certificate]
                        ,sc.IssuanceDate
                    from extension.StaffCredential as sc
                    left join edfi.CredentialType as ct ON ct.CredentialTypeId = sc.CredentialTypeId
                    left join certDescription as cd on cd.CredentialFieldDescriptorId = sc.CredentialFieldDescriptorId
                )
                ,degress as (
                    select
                         pp.StaffUSI
                        ,pp.MajorSpecialization
                        ,CASE
                            WHEN
                                da.CodeValue IN ('Masters', 'Master', 'M.ED', 'MED', 'MS', 'MA')
                                OR da.CodeValue LIKE 'MA-%'
                                OR da.CodeValue LIKE 'Master%'
                                OR da.CodeValue LIKE 'MBA%'
                                OR da.CodeValue LIKE 'M. Ed%'
                                OR da.CodeValue LIKE 'MA %'
                                OR da.CodeValue LIKE 'MA-%'
                                OR da.CodeValue LIKE 'MS %'
                                OR da.CodeValue LIKE 'MS-%'		
                            THEN 'Masters'

                            WHEN 
                                da.CodeValue IN ('BACHELORS', 'BFA', 'BA', 'BS') 
                                OR da.CodeValue LIKE 'Bach%'
                                OR da.CodeValue LIKE 'B.A.%'
                                OR da.CodeValue LIKE 'BA %'
                                OR da.CodeValue LIKE 'B.S.%'
                                OR da.CodeValue LIKE 'BS %'
                            THEN 'Bachelors'

                            WHEN 
                                da.CodeValue IN ('CERT', 'HVACR CERTIFIED', 'TEACHING CERTIFICATION') 
                                OR da.CodeValue LIKE 'Certif%'			
                            THEN 'Certificate'

                            WHEN 
                                da.CodeValue IN ('DOCTORATE', 'ED.D.')
                                OR da.CodeValue LIKE 'DOCTOR%'
                            THEN 'Doctorate'

                            WHEN 
                                da.CodeValue IN ('Associates', 'Assoc', 'Associates') 
                                OR da.CodeValue LIKE 'Assoc%'
                            THEN 'Associates'

                            WHEN 
                                da.CodeValue IN ('NO DEGREE', 'None', 'N/A') 
                            THEN 'No Degree'

                        ELSE 'Other'
                        END as Degree
                        ,lda.LevelOfDegreeAwardedDescriptorId
                    from extension.StaffTeacherPreparationProgram as pp
                    join extension.LevelOfDegreeAwardedDescriptor as lda ON lda.LevelOfDegreeAwardedDescriptorId = pp.LevelOfDegreeAwardedDescriptorId
                    join edfi.Descriptor as da ON da.DescriptorId = lda.LevelOfDegreeAwardedDescriptorId
                )
                ,allMeasures as (
                    select
                         pm.PersonBeingReviewedStaffUSI as StaffUsi
                        ,pm.TpdmRubricTypeDescriptorId as Category
                        ,pm.TpdmRubricTitle as SubCategory
                        ,pm.Score
                        ,cast(pm.PerformanceMeasureComment as varchar(1000)) as Comments
                        ,pm.ActualDateOfPerformanceMeasure as MeasureDate
                    from extension.PerformanceMeasure as pm
                )
                ,mostrecent as (
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
                ,rubric as (
                    select 
                         de.CodeValue as MeasureCategory
                        ,de.DescriptorID
                    from edfi.Descriptor as de
                    join extension.RubricTypeDescriptor as rtd on rtd.RubricTypeDescriptorID = de.DescriptorID
                )

                select
                     s.StaffUSI
                    ,s.StaffUniqueId
                    ,s.FirstName
                    ,s.MiddleName
                    ,s.LastSurname
                    ,'' as FullName

                    ,staffService.YearsOfService

                    ,a.Position as Assignment
                    ,a.StartDate

                    ,c.Certificate as Certification
                    ,c.IssuanceDate

                    ,d.Degree

                    ,ru.MeasureCategory as RatingCategory
                    ,mr.SubCategory as RatingSubCategory
                    ,coalesce(cast(pm.Score as decimal(5,2)), 0.0) as Rating

                from edfi.Staff as s
                left join staffService on staffService.StaffUSI = s.StaffUSI
                left join assignments as a on a.StaffUSI = s.StaffUSI
                left join certifications as c on c.StaffUSI = s.StaffUSI
                left join degress as d on d.StaffUSI = s.StaffUSI
                left join extension.PerformanceMeasure as pm on pm.PersonBeingReviewedStaffUSI = s.StaffUSI
                left join mostrecent as mr on mr.Category = pm.TpdmRubricTypeDescriptorId
                    and mr.SubCategory = pm.TpdmRubricTitle
                    and mr.StaffUsi = pm.PersonBeingReviewedStaffUSI
                    and mr.MeasureDate = pm.ActualDateOfPerformanceMeasure
                left join rubric as ru on ru.DescriptorId = pm.TpdmRubricTypeDescriptorId
                {(ClauseConditions(body))}
                order by case when {fieldMapping[sortField]} is null then 1 else 0 end, {fieldMapping[sortField]} {sortBy}
                offset {((currentPage - 1) * pageSize)} rows
                fetch next {pageSize} rows only
            ";

            return await _edfiDbContext.StaffSearches.FromSqlRaw(sql).ToListAsync();
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

        private static string ClauseYears(int min, int max)
        {
            if (min > 0 || max > 0)
            {
                // Provide the condition being searched for matching your schema. Example: "(y.YearsOfService >= min and y.YearsOfService <= max)"
                return $"({(min > 0 ? $"staffService.YearsOfService >= {min}" : "")}{(min > 0 && max > 0 ? " and " : "")}{(max > 0 ? $"staffService.YearsOfService <= {max}" : "")})";
            }

            return string.Empty;
        }

        private static string ClauseAssignments(ProfileSearchRequestAssignments assignments)
        {
            if (assignments != null && (!string.IsNullOrWhiteSpace(assignments.StartDate) || assignments.Values.Any()))
            {
                // Provide the condition being searched for matching your schema. Examples: "(a.StartDate = '1982-07-14')" or "(a.StartDate = '1982-07-14' and a.PositionId IN (5432, 234, 5331, 34))"
                return $"({(!string.IsNullOrWhiteSpace(assignments.StartDate) ? $"a.StartDate = cast('{assignments.StartDate}' as date)" : "")}{(!string.IsNullOrWhiteSpace(assignments.StartDate) && assignments.Values.Any() ? " and " : "")}{(assignments.Values.Any() ? $"a.KleinStaffClassificationDescriptorId in ({string.Join(",", assignments.Values)})" : "")})";
            }

            return string.Empty;
        }

        private static string ClauseCertifications(ProfileSearchRequestCertifications certifications)
        {
            if (certifications != null && (!string.IsNullOrWhiteSpace(certifications.IssueDate) || certifications.Values.Any()))
            {
                // Provide the condition being searched for matching your schema. Examples: "(c.IssueDate = '2017-04-23')" or "(c.IssueDate = '2017-04-23' and c.CertificationId IN (234, 12, 98))"
                return $"({(!string.IsNullOrWhiteSpace(certifications.IssueDate) ? $"c.IssuanceDate = cast('{certifications.IssueDate}' as date)" : "")}{(!string.IsNullOrWhiteSpace(certifications.IssueDate) && certifications.Values.Any() ? " and " : "")}{(certifications.Values.Any() ? $"c.CredentialFieldDescriptorId in ({string.Join(",", certifications.Values)})" : "")})";
            }

            return string.Empty;
        }

        private static string ClauseDegrees(ProfileSearchRequestDegrees degrees)
        {
            if (degrees != null && degrees.Values.Any())
            {
                // Provide the condition being searched for matching your schema. Example: "(d.DegreeId = 68)"
                return $"({(degrees.Values.Any() ? $"d.LevelOfDegreeAwardedDescriptorId in ({string.Join(",", degrees.Values)})" : "")})";
            }

            return string.Empty;
        }

        private static string ClauseRatings(ProfileSearchRequestRatings ratings)
        {
            if (ratings != null && ratings.Score > 0)
            {
                // Provide the condition being searched for matching your schema. Examples: "(r.Rating = 3)" or "(r.Rating = 3 and r.RatingCateogryId = 45)"
                var whereCategory = ratings.CategoryId > 0 ? $"mr.Category = {ratings.CategoryId}" : string.Empty;
                var andCatAndScore = ratings.CategoryId > 0 && ratings.Score > 0 ? " and " : string.Empty;
                var whereScore = ratings.Score > 0 ? $"pm.Score = {ratings.Score}" : string.Empty;
                var andScoreAndSub = !string.IsNullOrWhiteSpace(ratings.SubCategory) && ratings.Score > 0 ? " and " : string.Empty;
                var whereSubCategory = !string.IsNullOrWhiteSpace(ratings.SubCategory) ? $"mr.SubCategory = '{ratings.SubCategory}'" : string.Empty;

                return $"({whereCategory}{andCatAndScore}{whereScore}{andScoreAndSub}{whereSubCategory})";
            }

            return string.Empty;
        }
    }
}