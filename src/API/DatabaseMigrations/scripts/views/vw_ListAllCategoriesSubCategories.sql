SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   VIEW [edfi].[vw_ListAllCategoriesSubCategories] AS

select distinct
     pm.TpdmRubricTypeDescriptorId as CategoryId
    ,d.CodeValue as Category
    ,pm.TpdmRubricTitle as [SubCategory]
from extension.PerformanceMeasure as pm
left join extension.RubricTypeDescriptor as rtd on rtd.RubricTypeDescriptorID = pm.TpdmRubricTypeDescriptorId
left join edfi.Descriptor as d on d.DescriptorId = rtd.RubricTypeDescriptorId

GO
