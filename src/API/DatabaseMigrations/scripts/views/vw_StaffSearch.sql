CREATE OR ALTER VIEW [edfi].[vw_StaffSearch] AS
with staffService as (
    select StaffUsi
         , sum(FLOOR(DATEDIFF(DAY, HireDate, HireDate) / 365.0 * 4) / 4) as YearsOfServiceTemp
    from edfi.StaffEducationOrganizationEmploymentAssociation
    group by StaffUsi
), staffYearsOfExperience as (
	Select Staffusi, YearsOfPriorProfessionalExperience as YearsOfService 
	from edfi.Staff
), assignments as (
    select seoaa.StaffUSI
         , seoaa.StaffClassificationDescriptorId
         , ksad.CodeValue  as [Position]
         , seoaa.BeginDate as StartDate
    from edfi.StaffEducationOrganizationAssignmentAssociation as seoaa
             left join edfi.Descriptor as ksad on ksad.DescriptorId = seoaa.StaffClassificationDescriptorId
)
   , degrees as (
    select pp.StaffUSI
         , pp.MajorSpecialization
         , CASE
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
         , lda.LevelOfDegreeAwardedDescriptorId
    from tpdm.StaffTeacherPreparationProgram as pp
             join tpdm.LevelOfDegreeAwardedDescriptor as lda
                  ON lda.LevelOfDegreeAwardedDescriptorId = pp.LevelOfDegreeAwardedDescriptorId
             join edfi.Descriptor as da ON da.DescriptorId = lda.LevelOfDegreeAwardedDescriptorId
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

     , staffYearsOfExperience.YearsOfService

     , a.Position     as Assignment
     , a.StartDate

     , seoaa.StaffClassificationDescriptorId

     , d.Degree
     , d.LevelOfDegreeAwardedDescriptorId

     , mr.Category    as RatingCategory
     , mr.Subcategory as RatingSubCategory
     , perr.Rating    as Rating

     , ss.School as Institution
     , ss.SchoolId as InstitutionId
     , se.Email as Email
     , st.Telephone as Telephone
from edfi.Staff as s
         left join staffService on staffService.StaffUSI = s.StaffUSI
         left join staffYearsOfExperience on staffYearsOfExperience.StaffUSI = s.StaffUSI
         join edfi.StaffEducationOrganizationAssignmentAssociation as seoaa on seoaa.StaffUSI = s.StaffUsi
         join assignments as a on a.StaffUSI = s.StaffUSI
         left join degrees as d on d.StaffUSI = s.StaffUSI
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