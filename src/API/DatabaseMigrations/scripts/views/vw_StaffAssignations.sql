CREATE OR ALTER VIEW [edfi].[vw_StaffAssignments] AS

SELECT sta.StaffUSI as EmployeeIDAnnon
    , sta.StaffUniqueId
	, sta.FirstName + ' ' +  sta.LastSurname as FullNameAnnon 
	, sex.CodeValue as Gender
	, race.CodeValue as Race
	, empeo.EducationOrganizationId
	, empeo.NameOfInstitution as SchoolNameAnnon
	, empeo.Discriminator
	, seoea.HireDate
	, seoea.EndDate
	, srd.CodeValue as ReasonEndDate
	, YEAR(GETDATE()) - YEAR(sta.BirthDate) as Age
	, aseo.NameOfInstitution as AssignedSchool
	, scd.CodeValue as Job
	, scd.CodeValue as PositionTitle
	, seoaa.BeginDate as StartDate
	, Cast(IIF(
		MONTH(seoea.HireDate) BETWEEN 7 AND 12,
		YEAR(seoea.HireDate)+1,
		YEAR(seoea.HireDate)) as float) as SchoolYear
	, schd.CodeValue as SchoolLevel
  
	, 1 as RetElig
	, '1' as TRSYrs
	, '1' as TotYrsExp

	FROM edfi.Staff sta
	LEFT JOIN edfi.Descriptor sex on sta.SexDescriptorId = sex.DescriptorId
	inner join edfi.StaffRace sr on sta.StaffUSI = sr.StaffUSI
	INNER JOIN edfi.Descriptor race on sr.RaceDescriptorId=race.DescriptorId
	INNER JOIN edfi.StaffEducationOrganizationEmploymentAssociation seoea on seoea.StaffUSI = sta.StaffUSI
	LEFT JOIN edfi.Descriptor srd on seoea.SeparationReasonDescriptorId = srd.DescriptorId
	INNER JOIN edfi.EducationOrganization empeo on seoea.EducationOrganizationId=empeo.EducationOrganizationId
	left JOIN edfi.StaffEducationOrganizationAssignmentAssociation seoaa on sta.StaffUSI=seoaa.StaffUSI and seoea.HireDate = seoaa.BeginDate
	INNER JOIN edfi.EducationOrganization aseo on seoaa.EducationOrganizationId=aseo.EducationOrganizationId
	LEFT JOIN edfi.Descriptor scd on seoaa.StaffClassificationDescriptorId = scd.DescriptorId
	LEFT JOIN edfi.SchoolCategory sc on empeo.EducationOrganizationId = sc.SchoolId
	LEFT JOIN edfi.Descriptor schd on sc.SchoolCategoryDescriptorId = schd.DescriptorId
	WHERE scd.CodeValue in ('Principal','Assistant Principal')
