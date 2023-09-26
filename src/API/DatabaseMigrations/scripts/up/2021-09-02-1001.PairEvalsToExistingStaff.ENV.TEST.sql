/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

/* The edfi.Persons with Evaluations are not edfi.Staff. Let's change that for test... */

/* Arbitrarily number Persons with Evaluations */
SELECT
      PersonId
    , Row_number() over (order by PersonId) as "Number"
INTO #EvaluatedPersons
FROM tpdm.EvaluationRatingResult
GROUP BY PersonId;

/* Match Persons with Arbitrarily numbered Staff */
UPDATE edfi.Staff
SET PersonId= eval.PersonId
FROM edfi.Staff staff
  INNER JOIN (SELECT StaffUSI, Row_number() over (order by StaffUSI) as "Number" FROM edfi.Staff) as numberedStaff on NumberedStaff.StaffUSI = staff.StaffUSI
  INNER JOIN #EvaluatedPersons eval on eval.Number = numberedStaff.Number

DROP TABLE IF EXISTS #EvaluatedPersons;
GO
