/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

CREATE OR ALTER VIEW [edfi].[vw_LeaderSearch] AS

With PerformanceData as (
	Select StaffUSI, SchoolYear
		, Cast([Domain 1] as float) as [Domain1], Cast([Domain 2] as float) as [Domain2], Cast([Domain 3] as float) as [Domain3], Cast([Domain 4] as float) as [Domain4], Cast([Domain 5] as float) as [Domain5]
		From (
			SELECT StaffUSI, SchoolYear, Left(ObjectiveTitle, 8) as Domain, Rating
				From [edfi].[vw_LeadershipProfileEvaluationObjective] as eo
				Where EvalNumber = 1
		) as Src
		Pivot (
			AVG(Rating)
			For Domain in ([Domain 1],[Domain 2],[Domain 3],[Domain 4],[Domain 5])
		) as PT
)
SELECT
	Cast(sa.EmployeeID as varchar(20)) as EmployeeID
	, sa.StaffUniqueId
	, sa.FullName
	, sa.NameOfInstitution
	, sa.Job
	, sa.Age
	, sa.SchoolLevel
	, sa.StartDate
	, sa.EndDate
	, sa.Gender
	, sa.Race
	, sa.ReasonEndDate AS VacancyCause
	, sa.SchoolYear
	, sa.PositionTitle
	, Cast(sa.TotalYearsOfExperience as varchar(10)) as TotalYearsOfExperience
	, COALESCE((pd.Domain1 + pd.Domain2 + pd.Domain3 + pd.Domain4 + pd.Domain5) / 5.0, 0.0E) AS OverallScore
	--cast(4 as float) AS OverallScore
	--, cast(1 as float) as Domain1, cast(2 as float) as Domain2, cast(3 as float) as Domain3, cast(4 as float) as Domain4, cast(5 as float) as Domain5
	--, pd.Domain1, pd.Domain2, pd.Domain3, pd.Domain4, pd.Domain5
	, COALESCE([Domain1], 0.0E0 ) as [Domain1], COALESCE([Domain2], 0.0E0) as [Domain2], COALESCE([Domain3], 0.0E0) as [Domain3], COALESCE([Domain4], 0.0E0) as [Domain4], COALESCE([Domain5], 0.0E0) as [Domain5]
	, Row_number() OVER (PARTITION BY sa.EmployeeID ORDER BY sa.SchoolYear DESC) AS EvalNumber
	FROM [edfi].[vw_StaffAssignments] AS sa
	left join PerformanceData as pd on sa.EmployeeID = pd.StaffUSI
	WHERE
		(sa.SchoolYear IS NOT NULL)
		AND (sa.EndDate < DATEFROMPARTS(sa.SchoolYear, 12, 31))
		AND (sa.SchoolYear <> 2024)
		--AND ReasonEnd
GO
