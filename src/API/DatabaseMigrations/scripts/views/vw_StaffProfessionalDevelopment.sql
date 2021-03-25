CREATE OR ALTER VIEW [edfi].[vw_StaffProfessionalDevelopment] AS
select
	 ea.StaffUSI
	,s.StaffUniqueId
	,ea.AttendanceDate
	,ltrim(ea.ProfessionalDevelopmentProgramName) ProfessionalDevelopmentTitle
	,eo.NameOfInstitution as [Location]
	,null as AlignmentToLeadership	
from extension.StaffProfessionalDevelopmentEventAttendance as ea
left join edfi.Staff as s on s.StaffUSI = ea.StaffUSI
left join edfi.EducationOrganization as eo on eo.EducationOrganizationId = ea.EducationOrganizationId
GO