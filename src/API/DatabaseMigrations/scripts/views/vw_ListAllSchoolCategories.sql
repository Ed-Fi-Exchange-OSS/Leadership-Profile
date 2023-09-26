/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW [edfi].[vw_ListAllSchoolCategories] AS


    SELECT
        d.CodeValue AS [Text]
        ,scd.SchoolCategoryDescriptorId AS [Value]
    FROM edfi.SchoolCategoryDescriptor AS scd
    LEFT JOIN edfi.Descriptor AS d ON d.DescriptorId = scd.SchoolCategoryDescriptorId
GO
