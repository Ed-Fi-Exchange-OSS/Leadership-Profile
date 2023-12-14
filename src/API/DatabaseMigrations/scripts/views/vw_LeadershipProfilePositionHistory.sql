/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW edfi.vw_LeadershipProfilePositionHistory AS
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
