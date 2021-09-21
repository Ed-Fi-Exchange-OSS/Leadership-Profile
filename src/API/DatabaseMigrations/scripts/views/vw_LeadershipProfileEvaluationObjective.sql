CREATE OR ALTER VIEW edfi.vw_LeadershipProfileEvaluationObjective AS
SELECT
    staff.StaffUSI
  , staff.StaffUniqueId
  , eorr.EvaluationObjectiveTitle AS ObjectiveTitle
  , eorr.Rating AS Rating
  , CAST(eorr.SchoolYear AS INT) AS SchoolYear
  , CAST(Row_number() OVER
    (PARTITION BY eorr.PersonId, eorr.EvaluationObjectiveTitle, eorr.SchoolYear
         ORDER BY eorr.SchoolYear DESC, eorr.EvaluationDate DESC, eorr.CreateDate DESC) AS INT) AS EvalNumber
FROM tpdm.EvaluationObjectiveRatingResult eorr
JOIN edfi.Staff AS staff ON staff.PersonId = eorr.PersonId
;
