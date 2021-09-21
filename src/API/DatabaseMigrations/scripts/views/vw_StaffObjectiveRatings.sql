CREATE OR ALTER VIEW [edfi].[vw_StaffObjectiveRatings] AS
with evaluationRatings as (
    select staff.StaffUSI,
         eorr.EvaluationObjectiveTitle as Category
         , eorr.Rating
         , eorr.EvaluationDate
         , Row_number() over (partition by eorr.PersonId, eorr.EvaluationObjectiveTitle order by eorr.EvaluationDate desc, eorr.CreateDate desc) as "Number"
    from tpdm.EvaluationObjectiveRatingResult eorr
    join edfi.Staff as staff on staff.PersonId = eorr.PersonId
)

select s.StaffUSI
     , ratings.Category
     , ratings.Rating

from edfi.Staff as s
join evaluationRatings as ratings on ratings.StaffUSI = s.StaffUSI and ratings.Number = 1
