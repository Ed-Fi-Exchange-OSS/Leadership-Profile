CREATE OR ALTER VIEW [edfi].[vw_ListAllDegrees] AS
select
     d.CodeValue as [Text]
    ,lod.LevelOfEducationDescriptorId as [Value]
from edfi.LevelOfEducationDescriptor as lod
left join edfi.Descriptor as d on d.DescriptorId = lod.LevelOfEducationDescriptorId
GO