CREATE OR ALTER   VIEW [edfi].[vw_StaffSearch] AS
with staffService as (
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

    ,staffService.YearsOfService

    ,a.Position
    ,a.StartDate

    ,c.Certificate
    ,c.IssuanceDate

    ,d.Degree

    ,ru.MeasureCategory as RatingCategory
    ,mr.SubCategory as RatingSubCategory
    ,pm.Score as Rating

from edfi.Staff as s
left join staffService on staffService.StaffUSI = s.StaffUSI
join assignments as a on a.StaffUSI = s.StaffUSI
join certifications as c on c.StaffUSI = s.StaffUSI
join degress as d on d.StaffUSI = s.StaffUSI
join extension.PerformanceMeasure as pm on pm.PersonBeingReviewedStaffUSI = s.StaffUSI
    inner join mostrecent as mr on mr.Category = pm.TpdmRubricTypeDescriptorId
        and mr.SubCategory = pm.TpdmRubricTitle
        and mr.StaffUsi = pm.PersonBeingReviewedStaffUSI
        and mr.MeasureDate = pm.ActualDateOfPerformanceMeasure
    left join rubric as ru on ru.DescriptorId = pm.TpdmRubricTypeDescriptorId
GO