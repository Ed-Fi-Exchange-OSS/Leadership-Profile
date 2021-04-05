CREATE OR ALTER VIEW edfi.vw_LeadershipProfileHeader AS
with staffService as (
    select
         StaffUsi
	,cast(sum(FLOOR(DATEDIFF(DAY, KleinHireDate, COALESCE(KleinEndDate, getdate()) )/365.0 * 4) / 4) as decimal(5,2)) as YearsOfService
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
    ,assignments.School
    ,staffService.YearsOfService
	,em.ElectronicMailAddress as [Email]
    ,assignments.Role as Position
	,st.TelephoneNumber as Telephone
FROM edfi.Staff as s
LEFT JOIN edfi.StaffAddress as sa ON sa.StaffUSI = s.StaffUSI
left join edfi.StaffTelephone as st on st.StaffUSI = s.StaffUSI
left join edfi.StaffElectronicMail as em on em.StaffUSI = s.StaffUSI
left join staffService on staffService.StaffUSI = s.StaffUSI
left join staffAssignments as assignments on assignments.StaffUSI = s.StaffUSI