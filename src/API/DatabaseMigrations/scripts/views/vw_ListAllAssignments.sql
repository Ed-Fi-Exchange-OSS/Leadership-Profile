SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [edfi].[vw_ListAllAssignments] AS
select distinct
     d.CodeValue as [Text]
    ,ksa.KleinStaffClassificationDescriptorId as [Value]
from extension.KleinStaffAssignment as ksa
join edfi.Descriptor as d on d.DescriptorId = ksa.KleinStaffClassificationDescriptorId
GO