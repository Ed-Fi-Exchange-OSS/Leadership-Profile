/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

IF NOT EXISTS(SELECT 1 FROM sys.columns
          WHERE Name = N'TpdmUsername'
          AND Object_ID = Object_ID(N'edfi.Staff'))
BEGIN
    ALTER TABLE [edfi].[Staff]
    ADD TpdmUsername nvarchar(256)
END
