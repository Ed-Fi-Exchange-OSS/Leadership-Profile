/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW edfi.vw_LeadershipProfileProfessionalDevelopment AS
SELECT
    s.StaffUSI,
    s.StaffUniqueId,
    sr.RecognitionDescription,
    sr.RecognitionAwardDate
FROM edfi.Staff s
-- INNER JOIN tpdm.ProfessionalDevelopmentEventAttendance pd ON pd.PersonId = s.PersonId
INNER JOIN edfi.StaffRecognition sr ON sr.StaffUSI = s.StaffUSI
