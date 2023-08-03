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
      , Avg(eorr.Rating) AS Rating
      , CAST(eorr.SchoolYear AS INT) AS SchoolYear
      , Min(eorr.EvaluationDate) as EvaluationDate
      , Min(eorr.CreateDate) as CreateDate
    FROM tpdm.EvaluationElementRatingResult eorr
    JOIN edfi.Staff AS staff ON staff.PersonId = eorr.PersonId
    group by     staff.StaffUSI
      , staff.StaffUniqueId
      , eorr.EvaluationObjectiveTitle 
      , CAST(eorr.SchoolYear AS INT) 
  ) as eorr
;
