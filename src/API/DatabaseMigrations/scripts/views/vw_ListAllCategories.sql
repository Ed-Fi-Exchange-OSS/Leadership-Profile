CREATE OR ALTER VIEW [edfi].[vw_ListAllCategories] AS
SELECT EvaluationObjectiveTitle as Category, SortOrder
FROM tpdm.EvaluationObjective
GROUP BY EvaluationObjectiveTitle, SortOrder
;
