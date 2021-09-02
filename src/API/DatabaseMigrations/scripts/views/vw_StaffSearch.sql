CREATE OR ALTER VIEW [edfi].[vw_StaffSearch] AS
with assignments as (
    select seoaa.StaffUSI
         , seoaa.StaffClassificationDescriptorId as [PositionId]
         , ksad.CodeValue  as [Position]
         , seoaa.BeginDate as StartDate
         , Row_number() over (partition by seoaa.StaffUSI order by BeginDate desc) as "Number"
     from edfi.StaffEducationOrganizationAssignmentAssociation as seoaa
     join edfi.Descriptor as ksad on ksad.DescriptorId = seoaa.StaffClassificationDescriptorId
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
),

staff_school (StaffUSI, School, Position, SchoolId) AS
(
    SELECT seoaa.StaffUSI, eo.NameOfInstitution, d.ShortDescription, seoaa.EducationOrganizationId
    FROM edfi.StaffEducationOrganizationAssignmentAssociation seoaa
    INNER JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
    INNER JOIN edfi.Descriptor d ON d.DescriptorId = seoaa.StaffClassificationDescriptorId
    WHERE seoaa.EndDate IS NULL OR seoaa.EndDate >= GETUTCDATE()
    GROUP BY seoaa.StaffUSI, eo.NameOfInstitution, d.ShortDescription, seoaa.EducationOrganizationId
),

staff_email (StaffUSI, Email) AS (
    SELECT StaffUSI, Email FROM 
    (SELECT StaffUSI, ElectronicMailAddress Email, ROW_NUMBER () OVER (PARTITION BY StaffUSI ORDER BY ElectronicMailTypeDescriptorId) RowNumber
    FROM edfi.StaffElectronicMail
    ) se WHERE se.RowNumber = 1
),
staff_telephone (StaffUSI, Telephone) AS (
    SELECT StaffUSI, TelephoneNumber FROM
    (
        SELECT 
        StaffUSI,
        TelephoneNumber,
        ROW_NUMBER() OVER (PARTITION BY StaffUSI ORDER BY TelephoneNumberTypeDescriptorId) RowNumber
        FROM edfi.StaffTelephone st
    ) st WHERE st.RowNumber = 1
)

select s.StaffUSI
     , s.StaffUniqueId
     , s.FirstName
     , s.MiddleName
     , s.LastSurname
     , CONCAT(s.FirstName, ' ', s.LastSurname) as FullName

     , s.YearsOfPriorProfessionalExperience as YearsOfService 

     , a.Position     as Assignment
     , a.StartDate
     , a.PositionId   as StaffClassificationDescriptorId

     , degreeDescriptor.CodeValue as Degree
     , s.HighestCompletedLevelOfEducationDescriptorId

     , mr.Category    as RatingCategory
     , mr.Subcategory as RatingSubCategory
     , perr.Rating    as Rating

     , ss.School as Institution
     , ss.SchoolId as InstitutionId
     , se.Email as Email
     , st.Telephone as Telephone
from edfi.Staff as s
         join assignments as a on a.StaffUSI = s.StaffUSI and a.Number = 1
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
         LEFT JOIN staff_school ss ON ss.StaffUSI = s.StaffUSI
         LEFT JOIN staff_email se ON se.StaffUSI = s.StaffUSI
         LEFT JOIN staff_telephone st ON st.StaffUSI = s.StaffUSI         
GO