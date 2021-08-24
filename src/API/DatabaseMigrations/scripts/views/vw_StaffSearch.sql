CREATE OR ALTER VIEW [edfi].[vw_StaffSearch] AS
with staffService as (
    select StaffUsi
         , sum(FLOOR(DATEDIFF(DAY, HireDate, HireDate) / 365.0 * 4) / 4) as YearsOfService
    from edfi.StaffEducationOrganizationEmploymentAssociation
    group by StaffUsi
)
   , assignments as (
     SELECT seoaa.StaffUSI
          , seoaa.StaffClassificationDescriptorId
          , ksad.CodeValue  as [Position]
          , seoaa.BeginDate as StartDate
          , eo.NameOfInstitution
          , seoaa.EducationOrganizationId
     FROM
		(
			SELECT StaffUSI, MAX(LatestUpdateDate) LatestModifiedDate
			FROM edfi.StaffEducationOrganizationAssignmentAssociation
			UNPIVOT(LatestUpdateDate FOR Dates IN (CreateDate, LastModifiedDate)) as u
			GROUP BY StaffUSI
		) AS latestAssignment
		JOIN edfi.StaffEducationOrganizationAssignmentAssociation as seoaa	   			
				ON seoaa.StaffUSI = latestAssignment.StaffUSI 
				and (LastModifiedDate = latestAssignment.LatestModifiedDate OR CreateDate = latestAssignment.LatestModifiedDate)
          LEFT JOIN edfi.Descriptor as ksad ON ksad.DescriptorId = seoaa.StaffClassificationDescriptorId
          LEFT JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
          LEFT JOIN edfi.Descriptor d ON d.DescriptorId = seoaa.StaffClassificationDescriptorId
          WHERE seoaa.EndDate IS NULL OR seoaa.EndDate >= GETUTCDATE()
	)
	, schoolLevel as (
          SELECT 
               ssa.StaffUSI, 
               ssa.SchoolId, 
               sc.SchoolCategoryDescriptorId, 
               sgld.Description as SchoolLevel
          FROM edfi.StaffSchoolAssociation ssa
          LEFT JOIN edfi.SchoolCategory sc on sc.SchoolId = ssa.SchoolId
          LEFT JOIN edfi.Descriptor sgld ON sgld.DescriptorId = sc.SchoolCategoryDescriptorId
	)
   , allMeasures as (
    select st.StaffUSI
         , rd.PerformanceEvaluationTypeDescriptorId as Category
         , rd.EvaluationObjectiveTitle              as Subcategory
         , perr.Rating

         , cast(per.Comments as varchar(1000))      as Comments
         , per.ActualDate                           as MeasureDate
    from tpdm.PerformanceEvaluationRatingReviewer as pm
             left join edfi.Staff as st on st.PersonId = pm.PersonId
             left join tpdm.PerformanceEvaluationRatingResult as PERR
                       on perr.PersonId = pm.PersonId
             left join tpdm.PerformanceEvaluationRating as PER
                       on per.PersonId = pm.PersonId
             left join edfi.Descriptor as d
                       on d.DescriptorId = pm.PerformanceEvaluationTypeDescriptorId
             left join tpdm.RubricDimension as rd
                       on rd.PerformanceEvaluationTypeDescriptorId = pm.PerformanceEvaluationTypeDescriptorId
)
   , mostrecent as (
    select StaffUsi
         , Category
         , SubCategory
         , max(MeasureDate) as MeasureDate
    from allMeasures
    group by Category
           , SubCategory
           , StaffUsi
)
   , rubric as (
    select de.CodeValue as MeasureCategory
         , de.DescriptorID
    from tpdm.RubricDimension as rd
             left join edfi.Descriptor as de
                       on de.DescriptorId = rd.PerformanceEvaluationTypeDescriptorId
)

select s.StaffUSI
     , s.StaffUniqueId
     , s.FirstName
     , s.MiddleName
     , s.LastSurname
     , CONCAT(s.FirstName, ' ', s.LastSurname) as FullName

	 -- Tenure
     , staffService.YearsOfService

	 -- Assignment/Position
     , a.Position     as Assignment
     , a.StartDate
	 , a.StaffClassificationDescriptorId

	 -- Level
	 , sl.SchoolCategoryDescriptorId
	 , COALESCE(sl.SchoolLevel, 'Unknown') as [Level]

	 -- Degree
     , degreeDescriptor.CodeValue as Degree
     , s.HighestCompletedLevelOfEducationDescriptorId

	 -- Rating
     , mr.Category    as RatingCategory
     , mr.Subcategory as RatingSubCategory
     , perr.Rating    as Rating

	 -- School/Institution
     , a.NameOfInstitution as Institution
     , a.EducationOrganizationId as InstitutionId
from edfi.Staff as s
         left join staffService on staffService.StaffUSI = s.StaffUSI
         left join assignments as a on a.StaffUSI = s.StaffUSI
         left join schoolLevel as sl on sl.StaffUSI = s.StaffUSI
         left join edfi.Descriptor as degreeDescriptor ON degreeDescriptor.DescriptorId = s.HighestCompletedLevelOfEducationDescriptorId
         left join tpdm.PerformanceEvaluationRatingResult as PERR
               on perr.PersonId = s.PersonId
         left join rubric
               on rubric.DescriptorId = perr.PerformanceEvaluationTypeDescriptorId
         left join tpdm.PerformanceEvaluationRating as PER
               on per.PersonId = s.PersonId
         left join mostrecent as mr on mr.Category = perr.PerformanceEvaluationTypeDescriptorId
               and mr.SubCategory = perr.PerformanceEvaluationTypeDescriptorId
               and mr.StaffUsi = s.StaffUSI
               and mr.MeasureDate = per.ActualDate
         left join rubric as ru on ru.DescriptorId = perr.PerformanceEvaluationTypeDescriptorId          
GO