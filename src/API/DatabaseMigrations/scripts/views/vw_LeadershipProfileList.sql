CREATE OR ALTER VIEW edfi.vw_LeadershipProfileList AS
with staffDegrees as (
    select
         pp.StaffUSI
        ,st.StaffUniqueId
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
    from extension.StaffTeacherPreparationProgram as pp
    left join edfi.Staff as st ON st.StaffUSI = pp.StaffUSI
    join extension.LevelOfDegreeAwardedDescriptor as lda ON lda.LevelOfDegreeAwardedDescriptorId = pp.LevelOfDegreeAwardedDescriptorId
    join edfi.Descriptor as da ON da.DescriptorId = lda.LevelOfDegreeAwardedDescriptorId
)
, staffDegreeSeq as (
    select
        StaffUSI
        ,StaffUniqueId
        ,MajorSpecialization as Major
        ,Degree
        ,CASE
            WHEN Degree = 'Other' THEN -1
            WHEN Degree = 'No Degree' THEN 0
            WHEN Degree = 'Certificate' THEN 1
            WHEN Degree = 'Associates' THEN 2
            WHEN Degree = 'Bachelors' THEN 3
            WHEN Degree = 'Masters' THEN 4
            WHEN Degree = 'Doctorate' THEN 5
        ELSE 0
        END as [Sequence]
    from staffDegrees
)
, staffHighestDegree as (
    select 
         StaffUsi
        ,max([Sequence]) as [Sequence]
    from staffDegreeSeq
    group by StaffUSI
)
,staffService as (
    select
         StaffUsi
        ,sum(FLOOR(DATEDIFF(DAY, KleinHireDate, COALESCE(KleinEndDate, getdate()) )/365.0 * 4) / 4) as YearsOfService
    from extension.KleinStaffEmployment
    group by StaffUsi
)
,staffAssignments as (
    select
        ksa.StaffUSI
        ,st.StaffUniqueId
        ,d.CodeValue as [Role]
        ,eo.NameOfInstitution as School
    from extension.KleinStaffAssignment as ksa
    left join edfi.Descriptor as d on d.DescriptorId = ksa.KleinStaffClassificationDescriptorId
    left join edfi.EducationOrganization as eo on eo.EducationOrganizationId = ksa.EducationOrganizationId
    left join edfi.Staff as st on st.StaffUSI = ksa.StaffUSI
    where ksa.KleinEndDate is NULL -- current assignment has null end date
)

SELECT
	 s.StaffUSI
	,s.StaffUniqueId
	,s.FirstName
	,s.MiddleName
	,s.LastSurname
	,null as Location
    ,sa.School as Institution
    ,staffService.YearsOfService
	,sds.Degree as [HighestDegree]
	,em.ElectronicMailAddress as [Email]
    ,sa.Role as Position
	,st.TelephoneNumber as [Telephone]
	,sds.Major
FROM edfi.Staff as s
left join edfi.StaffElectronicMail as em on em.StaffUSI = s.StaffUSI
left join edfi.StaffTelephone as st on st.StaffUSI = s.StaffUSI
left join staffHighestDegree as hd on hd.StaffUSI = s.StaffUSI 
join staffDegreeSeq as sds on sds.[Sequence] = hd.[Sequence] and sds.StaffUSI = hd.StaffUSI
left join staffService on staffService.StaffUSI = s.StaffUSI
left join staffAssignments as sa on sa.StaffUSI = s.StaffUSI