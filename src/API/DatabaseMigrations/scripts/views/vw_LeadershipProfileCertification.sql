/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW edfi.vw_LeadershipProfileCertification AS
SELECT
	s.StaffUSI,
	s.StaffUniqueId,
    credentialDesc.Description 'Description',
    credentialType.Description CredentialType,
    IssuanceDate,
    ExpirationDate
FROM edfi.Credential c
INNER JOIN edfi.StaffCredential sc ON sc.CredentialIdentifier = c.CredentialIdentifier
INNER JOIN edfi.Descriptor credentialType ON credentialType.DescriptorId = c.CredentialTypeDescriptorId
INNER JOIN edfi.Descriptor credentialDesc ON credentialDesc.DescriptorId = c.CredentialFieldDescriptorId
INNER JOIN edfi.Staff s ON s.StaffUSI = sc.StaffUSI
