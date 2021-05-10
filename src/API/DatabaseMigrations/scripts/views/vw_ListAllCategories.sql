CREATE OR ALTER VIEW [edfi].[vw_ListAllCategories] AS
select
    de.CodeValue as [Text]
     ,de.DescriptorID as [Value]
from tpdm.RubricDimension as rd
         left join edfi.Descriptor as de
                   on de.DescriptorId = rd.PerformanceEvaluationTypeDescriptorId
GO