/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW edfi.vw_LeadershipProfileEvaluationObjective AS
Select *
	, CAST(Row_number() OVER (
      PARTITION BY eorr.StaffUniqueId, eorr.ObjectiveTitle, eorr.SchoolYear
      ORDER BY eorr.SchoolYear DESC, eorr.EvaluationDate DESC, eorr.CreateDate DESC
    ) AS INT) AS EvalNumber
	From (
    SELECT
      staff.StaffUSI
      , staff.StaffUniqueId
      , eorr.EvaluationObjectiveTitle AS ObjectiveTitle
	  , eorr.EvaluationTitle
      , Avg(eorr.Rating) AS Rating
      , CAST(eorr.SchoolYear AS INT) AS SchoolYear
      , Min(eorr.EvaluationDate) as EvaluationDate
      , Min(eorr.CreateDate) as CreateDate
    FROM tpdm.EvaluationElementRatingResult eorr
    JOIN edfi.Staff AS staff ON staff.StaffUniqueId = eorr.PersonId
    group by     staff.StaffUSI
      , staff.StaffUniqueId
      , eorr.EvaluationObjectiveTitle
	  , eorr.EvaluationTitle
      , CAST(eorr.SchoolYear AS INT)
  ) as eorr
;
