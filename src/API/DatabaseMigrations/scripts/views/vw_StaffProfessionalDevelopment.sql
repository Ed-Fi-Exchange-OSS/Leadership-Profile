CREATE OR ALTER VIEW [edfi].[vw_StaffProfessionalDevelopment]
AS

select
     st.StaffUSI
	,st.StaffUniqueId
    -- ,pdea.AttendanceDate
    ,Cast('1970-01-01' as date) as AttendanceDate
    -- ,pdea.ProfessionalDevelopmentTitle
    , '' as ProfessionalDevelopmentTitle
    ,sr.RecognitionDescription
    ,sr.RecognitionAwardDate
    ,eo.NameOfInstitution as Location
    ,NULL as AlignmentToLeadership
from edfi.Staff as st
left join edfi.Person as pe on pe.PersonId = st.PersonId
-- left join tpdm.ProfessionalDevelopmentEventAttendance as pdea on pdea.PersonId = pe.PersonId
left Join (Select * from (Select 0 as PersonId, null as AttendanceEventCategoryDescriptorId) as testpdea ) as pdea on pdea.PersonId = pe.PersonId
left join edfi.StaffRecognition as sr ON sr.StaffUSI = sr.StaffUSI
left join edfi.StaffEducationOrganizationAssignmentAssociation as eoaa on eoaa.StaffUSI = st.StaffUSI
left join edfi.EducationOrganization as eo on eo.EducationOrganizationId = eoaa.EducationOrganizationId
join edfi.AttendanceEventCategoryDescriptor as aecd on aecd.AttendanceEventCategoryDescriptorId = pdea.AttendanceEventCategoryDescriptorId
