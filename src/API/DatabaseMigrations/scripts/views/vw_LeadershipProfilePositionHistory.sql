CREATE OR ALTER VIEW edfi.LeadershipProfilePositionHistory AS
SELECT
	s.StaffUSI,
	s.StaffUniqueId,
    d.ShortDescription 'Role',
    eo.NameOfInstitution School, 
    seoaa.BeginDate StartDate,
    seoaa.EndDate 
FROM edfi.StaffEducationOrganizationAssignmentAssociation seoaa
INNER JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
INNER JOIN edfi.Descriptor d ON d.DescriptorId = seoaa.StaffClassificationDescriptorId
INNER JOIN edfi.Staff s ON s.StaffUSI = seoaa.StaffUSI