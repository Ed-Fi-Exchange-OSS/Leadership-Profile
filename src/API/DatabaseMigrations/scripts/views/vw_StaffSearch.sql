/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW [edfi].[vw_StaffSearch] AS
with assignments as (
    select seoaa.StaffUSI
         , seoaa.StaffClassificationDescriptorId as [PositionId]
         , ksad.CodeValue  as [Position]
         , eo.EducationOrganizationId as [InstitutionId]
		 , sc.SchoolCategoryDescriptorId as [InstitutionCategoryId]
         , eo.NameOfInstitution as [Institution]
         , seoaa.BeginDate as StartDate
		 , seoaa.EndDate as EndDate
         , Row_number() over (partition by seoaa.StaffUSI order by BeginDate desc) as "Number"
		 ,CASE
                        WHEN YEAR(seoaa.EndDate) >= YEAR(GETDATE()) OR seoaa.EndDate IS NULL
                            THEN CAST(1 AS BIT)
                            ELSE CAST(0 AS BIT)
                     END as IsActive
     from edfi.StaffEducationOrganizationAssignmentAssociation as seoaa
     join edfi.EducationOrganization eo on eo.EducationOrganizationId = seoaa.EducationOrganizationId
	 left join edfi.SchoolCategory sc on sc.SchoolId = seoaa.EducationOrganizationId
     join edfi.Descriptor as ksad on ksad.DescriptorId = seoaa.StaffClassificationDescriptorId
)
, staff_email (StaffUSI, Email) AS (
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

select DISTINCT s.StaffUSI
     , s.StaffUniqueId
     , s.FirstName
     , s.MiddleName
     , s.LastSurname
     , CONCAT(s.FirstName, ' ', s.LastSurname) as FullName

     , s.YearsOfPriorProfessionalExperience as YearsOfService

     , a.Position     as Assignment
     , a.PositionId   as StaffClassificationDescriptorId
     , a.Institution
     , a.InstitutionId
	 , a.InstitutionCategoryId
	 , a.IsActive
     , degreeDescriptor.CodeValue as Degree
     , s.HighestCompletedLevelOfEducationDescriptorId

     , se.Email as Email
     , st.Telephone as Telephone
	 , CASE
                        WHEN gisda.AspiresNextRole = 'YES'
                            THEN CAST(1 AS BIT)
                            ELSE CAST(0 AS BIT)
                     END as InterestedInNextRole
from edfi.Staff as s
         join assignments as a on a.StaffUSI = s.StaffUSI and a.Number = 1
         left join edfi.Descriptor as degreeDescriptor ON degreeDescriptor.DescriptorId = s.HighestCompletedLevelOfEducationDescriptorId
         LEFT JOIN staff_email se ON se.StaffUSI = s.StaffUSI
         LEFT JOIN staff_telephone st ON st.StaffUSI = s.StaffUSI
		 LEFT JOIN GISD_Staff giss ON giss.FirstName = s.FirstName and giss.LastSurname = s.LastSurname
		 LEFT JOIN dbo.GISDAspirations gisda ON gisda.ID = giss.UniqueId
GO







