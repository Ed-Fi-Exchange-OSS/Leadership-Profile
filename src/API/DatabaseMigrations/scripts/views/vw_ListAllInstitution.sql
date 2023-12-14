/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER  VIEW [edfi].[vw_ListAllInstitutions] AS
    SELECT DISTINCT
        seoaa.EducationOrganizationId as [Value],
        eo.NameOfInstitution as [Text]
    FROM
        edfi.StaffEducationOrganizationAssignmentAssociation seoaa
        INNER JOIN edfi.EducationOrganization eo ON eo.EducationOrganizationId = seoaa.EducationOrganizationId
    WHERE seoaa.EndDate IS NULL OR seoaa.EndDate >= GETUTCDATE()
GO
