SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [edfi].[vw_ListAllDegrees] AS

select
     d.CodeValue as [Text]
    ,lod.LevelOfDegreeAwardedDescriptorId as [Value]
from extension.LevelOfDegreeAwardedDescriptor as lod
left join edfi.Descriptor as d on d.DescriptorId = lod.LevelOfDegreeAwardedDescriptorId

GO