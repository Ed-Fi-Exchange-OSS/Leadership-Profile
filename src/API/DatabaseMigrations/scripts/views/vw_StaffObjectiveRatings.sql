CREATE OR ALTER VIEW [edfi].[vw_StaffObjectiveRatings] AS
Select 
	staff.StaffUSI
    , eorr.EvaluationObjectiveTitle as Category
    , Avg(eorr.Rating) as Rating
    , Max(eorr.EvaluationDate) as EvaluationDate
	From tpdm.EvaluationElementRatingResult eorr
	Join edfi.Staff as staff on staff.PersonId = eorr.PersonId
	Group by staff.StaffUSI, eorr.EvaluationObjectiveTitle

GO