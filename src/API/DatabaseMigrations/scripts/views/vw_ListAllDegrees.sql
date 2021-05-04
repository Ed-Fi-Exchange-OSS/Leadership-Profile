CREATE OR ALTER VIEW [edfi].[vw_ListAllDegrees] AS
select
     d.CodeValue as [Text]
    ,lod.LevelOfDegreeAwardedDescriptorId as [Value]
from tpdm.LevelOfDegreeAwardedDescriptor as lod
left join edfi.Descriptor as d on d.DescriptorId = lod.LevelOfDegreeAwardedDescriptorId
GO