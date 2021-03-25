SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   VIEW [edfi].[vw_ListAllPerformanceCategories] AS

select distinct
     d.CodeValue as [Text]
    ,d.DescriptorId as [Value]
from extension.RubricTypeDescriptor as ru
left join edfi.Descriptor as d on d.DescriptorId = ru.RubricTypeDescriptorId
join extension.PerformanceMeasure as pm on pm.TpdmRubricTypeDescriptorId = ru.RubricTypeDescriptorId

GO