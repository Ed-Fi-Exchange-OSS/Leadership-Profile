CREATE OR ALTER VIEW [edfi].[vw_StaffProfessionalDevelopment]
AS
select
     st.StaffUSI
	,st.StaffUniqueId
    -- ,pdea.AttendanceDate
    -- ,pdea.ProfessionalDevelopmentTitle
    ,sr.RecognitionDescription
    ,sr.RecognitionAwardDate
    ,eo.NameOfInstitution as Location
    ,NULL as AlignmentToLeadership
from edfi.Staff as st
left join edfi.Person as pe on pe.PersonId = st.PersonId
-- left join tpdm.ProfessionalDevelopmentEventAttendance as pdea on pdea.PersonId = pe.PersonId
left join edfi.StaffRecognition as sr ON sr.StaffUSI = sr.StaffUSI
left join edfi.StaffEducationOrganizationAssignmentAssociation as eoaa on eoaa.StaffUSI = st.StaffUSI
left join edfi.EducationOrganization as eo on eo.EducationOrganizationId = eoaa.EducationOrganizationId
--join edfi.AttendanceEventCategoryDescriptor as aecd on aecd.AttendanceEventCategoryDescriptorId = sr.AttendanceEventCategoryDescriptorId