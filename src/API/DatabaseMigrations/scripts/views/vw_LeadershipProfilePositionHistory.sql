CREATE OR ALTER VIEW edfi.vw_LeadershipProfilePositionHistory AS
select
	 ksa.StaffUSI
	,st.StaffUniqueId
	,d.CodeValue as [Role]
	,eo.NameOfInstitution as School
	,ksa.KleinBeginDate as StartDate
	,ksa.KleinEndDate as [EndDate]
from extension.KleinStaffAssignment as ksa
left join edfi.Descriptor as d on d.DescriptorId = ksa.KleinStaffClassificationDescriptorId
left join edfi.EducationOrganization as eo on eo.EducationOrganizationId = ksa.EducationOrganizationId
left join edfi.Staff as st on st.StaffUSI = ksa.StaffUSI