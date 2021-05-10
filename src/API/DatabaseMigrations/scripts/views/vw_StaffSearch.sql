CREATE OR ALTER VIEW [edfi].[vw_StaffSearch] AS
with staffService as (
    select StaffUsi
         , sum(FLOOR(DATEDIFF(DAY, HireDate, HireDate) / 365.0 * 4) / 4) as YearsOfService
    from edfi.StaffEducationOrganizationEmploymentAssociation
    group by StaffUsi
)
   , assignments as (
    select seoaa.StaffUSI
         , seoaa.StaffClassificationDescriptorId
         , ksad.CodeValue  as [Position]
         , seoaa.BeginDate as StartDate
    from edfi.StaffEducationOrganizationAssignmentAssociation as seoaa
             left join edfi.Descriptor as ksad on ksad.DescriptorId = seoaa.StaffClassificationDescriptorId
)
   , certDescription as (
    select distinct Credential.CredentialFieldDescriptorId
                  , theDescriptors.CodeValue [Credential Field]
                  , oah.AssessmentIdentifier [Certification Academic Subject]
                  , oah.Description          [Certification Academic Subject Description]
    from EdFi.CredentialFieldDescriptor
             left join edfi.Credential
                       on Credential.CredentialFieldDescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
             left join EdFi.Descriptor theDescriptors
                       on theDescriptors.DescriptorId = CredentialFieldDescriptor.CredentialFieldDescriptorId
             left join EdFi.ObjectiveAssessmentH oah
                       on oah.AcademicSubjectDescriptorId = theDescriptors.DescriptorId
)
   , certifications as (
    select sc.StaffUSI
         , cd.CredentialFieldDescriptorId
         , COALESCE(cd.[Certification Academic Subject], cd.[Credential Field]) [Certificate]
         , sc.CreateDate as                                                     IssuanceDate
    from edfi.StaffCredential as sc
             left join edfi.Credential as ct ON ct.CredentialIdentifier = sc.CredentialIdentifier
             left join certDescription as cd on cd.CredentialFieldDescriptorId = ct.CredentialFieldDescriptorId
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
)

select s.StaffUSI
     , s.StaffUniqueId
     , s.FirstName
     , s.MiddleName
     , s.LastSurname
     , ''             as FullName

     , staffService.YearsOfService

     , a.Position     as Assignment
     , a.StartDate

     , seoaa.StaffClassificationDescriptorId

     , c.Certificate  as Certification
     , c.IssuanceDate
     , c.CredentialFieldDescriptorId

     , d.Degree
     , d.LevelOfDegreeAwardedDescriptorId

     , mr.Category    as RatingCategory
     , mr.Subcategory as RatingSubCategory
     , perr.Rating    as Rating


from edfi.Staff as s
         left join staffService on staffService.StaffUSI = s.StaffUSI
         join edfi.StaffEducationOrganizationAssignmentAssociation as seoaa on seoaa.StaffUSI = s.StaffUsi
         join assignments as a on a.StaffUSI = s.StaffUSI
         join certifications as c on c.StaffUSI = s.StaffUSI
         join degrees as d on d.StaffUSI = s.StaffUSI
         join tpdm.PerformanceEvaluationRatingResult as PERR
              on perr.PersonId = s.PersonId
         left join rubric
                   on rubric.DescriptorId = perr.PerformanceEvaluationTypeDescriptorId
         left join tpdm.PerformanceEvaluationRating as PER
                   on per.PersonId = s.PersonId
         inner join mostrecent as mr on mr.Category = perr.PerformanceEvaluationTypeDescriptorId
    and mr.SubCategory = perr.PerformanceEvaluationTypeDescriptorId
    and mr.StaffUsi = s.StaffUSI
    and mr.MeasureDate = per.ActualDate
         left join rubric as ru on ru.DescriptorId = perr.PerformanceEvaluationTypeDescriptorId
GO