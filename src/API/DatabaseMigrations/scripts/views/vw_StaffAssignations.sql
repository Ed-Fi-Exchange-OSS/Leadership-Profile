CREATE OR ALTER VIEW [edfi].[vw_StaffAssignments] AS

SELECT sta.StaffUSI, sta.FirstName, sta.LastSurname, sex.CodeValue as Gender, race.CodeValue as Race
, empeo.EducationOrganizationId, empeo.NameOfInstitution as EmploydEdOrg, empeo.Discriminator, seoea.HireDate, seoea.EndDate, srd.CodeValue as SeparationReasonDescriptor
, YEAR(GETDATE()) - YEAR(sta.BirthDate) as Age
--, seoaa.EducationOrganizationId
, aseo.NameOfInstitution as AssignedSchool, scd.CodeValue as PositionTitle, seoaa.BeginDate
, IIF(
	MONTH(seoea.HireDate) BETWEEN 8 AND 12,
	YEAR(seoea.HireDate)+1,
	YEAR(seoea.HireDate)) as SchoolYear
, schd.CodeValue as SchoolCategory
--, seoaa.EndDate
--, seoaa.*
  
FROM edfi.Staff sta
INNER JOIN edfi.Descriptor sex on sta.SexDescriptorId = sex.DescriptorId
inner join edfi.StaffRace sr on sta.StaffUSI = sr.StaffUSI
INNER JOIN edfi.Descriptor race on sr.RaceDescriptorId=race.DescriptorId
INNER JOIN edfi.StaffEducationOrganizationEmploymentAssociation seoea on seoea.StaffUSI = sta.StaffUSI
LEFT JOIN edfi.Descriptor srd on seoea.SeparationReasonDescriptorId = srd.DescriptorId
INNER JOIN edfi.EducationOrganization empeo on seoea.EducationOrganizationId=empeo.EducationOrganizationId
INNER JOIN edfi.StaffEducationOrganizationAssignmentAssociation seoaa on sta.StaffUSI=seoaa.StaffUSI
INNER JOIN edfi.EducationOrganization aseo on seoaa.EducationOrganizationId=aseo.EducationOrganizationId
LEFT JOIN edfi.Descriptor scd on seoaa.StaffClassificationDescriptorId = scd.DescriptorId
LEFT JOIN edfi.SchoolCategory sc on empeo.EducationOrganizationId = sc.SchoolId
LEFT JOIN edfi.Descriptor schd on sc.SchoolCategoryDescriptorId = schd.DescriptorId
--WHERE scd.CodeValue in ('Principal','Assistant Principal')
--ORDER BY sta.StaffUSI




