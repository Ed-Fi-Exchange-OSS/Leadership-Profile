CREATE OR ALTER   View [dbo].[vw_StaffVacancy] AS
SELECT        
	sa.EmployeeIDAnnon
	, sa.FullNameAnnon
	, sa.SchoolNameAnnon
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
	, sa.RetElig
	, sa.TRSYrs
	, sa.TotYrsExp, 
	--(pd.Domain1 + pd.Domain2 + pd.Domain3 + pd.Domain4 + pd.Domain5) / 5 AS OverallScore
	cast(4 as float) AS OverallScore
	, 1 as Domain1, 2 as Domain2, 3 as Domain3, 4 as Domain4, 5 as Domain5
	--, pd.Domain1, pd.Domain2, pd.Domain3, pd.Domain4, pd.Domain5
	FROM [edfi].[vw_StaffAssignments] AS sa 
	--INNER JOIN dbo.PerformanceData AS pd ON sa.FullNameAnnon = pd.FullNameAnnon
	WHERE        
		(sa.SchoolYear IS NOT NULL) 
		AND (sa.EndDate < DATEFROMPARTS(sa.SchoolYear, 12, 31)) 		
		AND (sa.SchoolYear <> 2024)