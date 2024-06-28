/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW [edfi].[vw_StaffObjectiveRatings] AS
Select
	staff.StaffUSI
    , eorr.EvaluationObjectiveTitle as Category
    , Avg(eorr.Rating) as Rating
    , Max(eorr.EvaluationDate) as EvaluationDate
	From tpdm.EvaluationElementRatingResult eorr
	Join edfi.Staff as staff on staff.StaffUniqueId = eorr.PersonId
	Group by staff.StaffUSI, eorr.EvaluationObjectiveTitle

GO
