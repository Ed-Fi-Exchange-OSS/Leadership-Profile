CREATE OR ALTER VIEW edfi.vw_LeadershipProfileHeader AS
with staff_school (StaffUSI, School, Position) AS
(
    SELECT seoaa.StaffUSI, eo.NameOfInstitution, d.ShortDescription
    FROM edfi.StaffEducationOrganizationAssignmentAssociation seoaa
    INNER JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
    INNER JOIN edfi.Descriptor d ON d.DescriptorId = seoaa.StaffClassificationDescriptorId
    WHERE seoaa.EndDate IS NULL OR seoaa.EndDate >= GETUTCDATE()
    GROUP BY seoaa.StaffUSI, eo.NameOfInstitution, d.ShortDescription
),
staff_email (StaffUSI, Email) AS (
    SELECT StaffUSI, Email FROM 
    (SELECT StaffUSI, ElectronicMailAddress Email, ROW_NUMBER () OVER (PARTITION BY StaffUSI ORDER BY ElectronicMailTypeDescriptorId) RowNumber
    FROM edfi.StaffElectronicMail
    ) se WHERE se.RowNumber = 1
),
staff_telephone (StaffUSI, Telephone) AS (
    SELECT StaffUSI, TelephoneNumber FROM
    (
        SELECT 
        StaffUSI,
        TelephoneNumber,
        ROW_NUMBER() OVER (PARTITION BY StaffUSI ORDER BY TelephoneNumberTypeDescriptorId) RowNumber
        FROM edfi.StaffTelephone st
    ) st WHERE st.RowNumber = 1
)
SELECT
s.StaffUSI,
s.StaffUniqueId,
FirstName,
MiddleName,
LastSurname,
sa.City Location,
ss.School,
s.YearsOfPriorTeachingExperience YearsOfService,
se.Email,
ss.Position,
st.Telephone
FROM edfi.Staff s
LEFT JOIN edfi.StaffAddress sa ON sa.StaffUSI = s.StaffUSI
LEFT JOIN staff_school ss ON ss.StaffUSI = s.StaffUSI
LEFT JOIN staff_email se ON se.StaffUSI = s.StaffUSI
LEFT JOIN staff_telephone st ON st.StaffUSI = s.StaffUSI